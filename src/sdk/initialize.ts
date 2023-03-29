import { wait } from '@/utils';

let initialized = false;
let go: Go;
let goExitPromise: Promise<void> | undefined;

export async function initializeWasm(url: string): Promise<Go | null> {
  if (initialized) {
    return null;
  }

  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  go = new Go();

  if ('instantiateStreaming' in WebAssembly) {
    const wasm = await WebAssembly.instantiateStreaming(
      fetch(url),
      go.importObject
    );
    goExitPromise = go.run(wasm.instance);
  } else {
    const bytes = await fetch(url).then(resp => resp.arrayBuffer());

    const wasm = await WebAssembly.instantiate(bytes, go.importObject);

    goExitPromise = go.run(wasm.instance);
  }

  await wait(100);

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
