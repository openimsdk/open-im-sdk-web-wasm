# open-im-sdk-wasm

## how to use

> [more details]()

- run `npm install open-im-sdk-wasm`
- export all assets files to your public forder(make sure you can access file by http request, and place the wasm_exec.js in your html file)
- then add code as below

  ```typescript
  import { getSDK } from 'open-im-sdk-wasm';

  const sdk = getSDK();
  ```
