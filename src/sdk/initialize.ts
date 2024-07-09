import { wait } from '@/utils';

let initialized = false;
let go: Go;
let goExitPromise: Promise<void> | undefined;

const CACHE_KEY = 'openim-wasm-cache';

export async function initializeWasm(url: string): Promise<Go | null> {
  if (initialized) {
    return null;
  }

  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  go = new Go();
  let wasm;
  try {
    if ('instantiateStreaming' in WebAssembly) {
      wasm = await WebAssembly.instantiateStreaming(
        fetchWithCache(url),
        go.importObject
      );
    } else {
      const bytes = await fetchWithCache(url).then(resp => resp.arrayBuffer());
      wasm = await WebAssembly.instantiate(bytes, go.importObject);
    }
    go.run(wasm.instance);
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    return null;
  }

  await wait(100);
  initialized = true;
  return go;
}

export function reset() {
  initialized = false;
}

export function getGO() {
  return go;
}

export function getGoExitPromise() {
  return goExitPromise;
}

async function fetchWithCache(url: string): Promise<Response> {
  if (!('caches' in window)) {
    return fetch(url);
  }

  const cache = await caches.open(CACHE_KEY);
  const cachedResponse = await cache.match(url);
  const isResourceUpdated = async () => {
    const serverResponse = await fetch(url, { method: 'HEAD' });
    const etag = serverResponse.headers.get('ETag');
    const lastModified = serverResponse.headers.get('Last-Modified');
    return (
      serverResponse.ok &&
      (etag !== cachedResponse?.headers.get('ETag') ||
        lastModified !== cachedResponse?.headers.get('Last-Modified'))
    );
  };

  if (cachedResponse && !(await isResourceUpdated())) {
    return cachedResponse;
  }

  return fetchAndUpdateCache(url, cache);
}

async function fetchAndUpdateCache(
  url: string,
  cache: Cache
): Promise<Response> {
  const response = await fetch(url, { cache: 'no-cache' });
  await cache.put(url, response.clone());
  return response;
}
