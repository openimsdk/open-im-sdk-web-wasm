import { wait } from '@/utils';

const initiallized = false;

export async function initializeWasm(url: string): Promise<void> {
  if (initiallized) {
    return;
  }

  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  const go = new Go();
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
}
