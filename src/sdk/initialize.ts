import { wait } from '@/utils';

let initiallized = false;
let go: Go;

export async function initializeWasm(url: string): Promise<Go | null> {
  if (initiallized) {
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
    go.run(wasm.instance);
  } else {
    const bytes = await fetch(url).then(resp => resp.arrayBuffer());

    const wasm = await WebAssembly.instantiate(bytes, go.importObject);
    go.run(wasm.instance);
  }

  await wait(100);

  return go;
}

export function reset() {
  initiallized = false;
}

export function getGO() {
  return go;
}
