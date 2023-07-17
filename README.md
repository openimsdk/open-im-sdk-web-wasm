## use demo

[Repository](https://github.com/OpenIMSDK/Open-IM-PC-Web-Demo)

## Integration steps(Webpack5+)

### 1. Add dependencies

```bash
npm install open-im-sdk-wasm
```

### 2. Obtain static resources required by wasm

> Find the `open-im-sdk-wasm` subdirectory in the `node_modules` directory under the project root directory, and copy all the files in the `assets` folder to the project public resource directory (public).

- Document List

```bash
openIM.wasm
sql-wasm.wasm
wasm_exec.js
```

- After the copy is complete, import the `wasm_exec.js` file through the script tag in your `index.html` file.

### 3. Import SDK

- Import SDK

```ts
import { getSDK } from 'open-im-sdk-wasm';

const OpenIM = getSDK();
```

- possible problems
  ![webpack5_error](./assets/webpack5_error.png)

- solution
  > The new configuration in the webpack configuration is as follows

```bash
resolve: {
      fallback: {
        path: false,
        crypto: false,
      },
    },
```

## Integration steps(Vite、Webpack4)

> The first and second steps are the same as above Webpack5+ import steps.

### Import SDK

#### Copy the lib directory in the npm package to the project, such as: src/utils/lib

#### If it is Webpack4, also need to introduce woker loader

- Install `worker-loader` and `worker-plugin`

```bash
npm install worker-loader worker-plugin -D
```

- Add configuration in webpack

```js
const WorkerPlugin = require("worker-plugin");

...
plugins: [new WorkerPlugin()]
...
```

#### Modify the import method of web worker in the lib/api/index.js file.

- Webpack4.x

```js
+ import IMWorker from 'worker-loader!./worker.js';

- worker = new Worker(new URL('./worker.js', import.meta.url));
+ worker = new IMWorker();
```

- Vite

```js
+ import IMWorker from './worker?worker';

- worker = new Worker(new URL('./worker.js', import.meta.url));
+ worker = new IMWorker();
```

#### Import

> The path is the path where `lib` is placed after copying

```ts
import { getSDK } from '@/utils/lib';

const OpenIM = getSDK();
```
