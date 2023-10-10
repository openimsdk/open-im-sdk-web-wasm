# JavaScript/TypeScript Client SDK for OpenIM 👨‍💻💬

Use this SDK to add instant messaging capabilities to your JavaScript/TypeScript app. By connecting to a self-hosted [OpenIM](https://www.openim.online/) server, you can quickly integrate instant messaging capabilities into your app with just a few lines of code.

The underlying SDK core is implemented in Go. JavaScript handles the logic of the SQL layer by virtualizing SQLite and storing it in IndexDB using [sql.js](https://sql.js.org/). The SDK exposes a re-encapsulated API for easy usage.

## Documentation 📚

Visit [https://doc.rentsoft.cn/](https://doc.rentsoft.cn/) for detailed documentation and guides.

For the SDK reference, see [https://doc.rentsoft.cn/sdks/quickstart/browser](https://doc.rentsoft.cn/sdks/quickstart/browser).

## Installation 💻

### Adding Dependencies

```shell
npm install open-im-sdk-wasm --save
```

### Obtaining Required Static Resources for WASM

Follow these steps to obtain the static resources required for WebAssembly (WASM):

1. Locate the `open-im-sdk-wasm` subdirectory in the `node_modules` directory of your project. Copy all the files in the `assets` folder to your project's public resource directory.

   The files to be copied are:

   - `openIM.wasm`
   - `sql-wasm.wasm`
   - `wasm_exec.js`

2. After copying the files, import the `wasm_exec.js` file in your `index.html` file using a `<script>` tag.

### Possible Issues ❗

#### For Webpack 5+

Add the following configuration to your Webpack configuration:

```js
resolve: {
  fallback: {
    fs: false,
    path: false,
    crypto: false,
  },
},
```

#### For Webpack 4 or Vite

**Note:**
If you are using `Webpack 4`, you will also need to install the worker loader.

```shell
npm install worker-loader worker-plugin -D
```

Add the following configuration to your Webpack configuration:

```js
const WorkerPlugin = require("worker-plugin");

// ...

plugins: [new WorkerPlugin()],

// ...
```

Follow these steps:

1. Copy the `lib` directory from the npm package to your project (e.g., `src/utils/lib`).

2. Modify the import method of the web worker in the `lib/api/index.js` file.

   `````js
   // For Webpack 4:
   + import IMWorker from 'worker-loader!./worker.js';
   // For Vite:
   + import IMWorker from './worker?worker';
   
   - worker = new Worker(new URL('./worker.js', import.meta.url));
   + worker = new IMWorker();
   `````

## Usage 🚀

The following examples demonstrate how to use the SDK. TypeScript is used, providing complete type hints.

### Importing the SDK

```typescript
import { getSDK } from 'open-im-sdk-wasm';
// or your own path after copying
// import { getSDK } from '@/utils/lib';

const OpenIM = getSDK();
```

### Logging In and Listening for Connection Status

```typescript
import { CbEvents } from 'open-im-sdk-wasm';
import type { WSEvent } from 'open-im-sdk-wasm';

OpenIM.on(CbEvents.OnConnecting, handleConnecting);
OpenIM.on(CbEvents.OnConnectFailed, handleConnectFailed);
OpenIM.on(CbEvents.OnConnectSuccess, handleConnectSuccess);

OpenIM.login({
  userID: 'IM user ID',
  token: 'IM user token',
  platformID: 5,
  apiAddr: 'http://ip:10002',
  wsAddr: 'ws://ip:10001',
});

function handleConnecting() {
  // Connecting...
}

function handleConnectFailed({ errCode, errMsg }: WSEvent) {
  // Connection failed ❌
  console.log(errCode, errMsg);
}

function handleConnectSuccess() {
  // Connection successful ✅
}
```

To log into the IM server, you need to create an account and obtain a user ID and token. Refer to the [access token documentation](https://doc.rentsoft.cn/restapi/userManagement/userRegister) for details.

### Receiving and Sending Messages 💬

OpenIM makes it easy to send and receive messages. By default, there is no restriction on having a friend relationship to send messages (although you can configure other policies on the server). If you know the user ID of the recipient, you can conveniently send a message to them.

```typescript
import { CbEvents } from 'open-im-sdk-wasm';
import type { WSEvent, MessageItem } from 'open-im-sdk-wasm';

// Listenfor new messages 📩
OpenIM.on(CbEvents.OnRecvNewMessages, handleNewMessages);

const message = (await OpenIM.createTextMessage('hello openim')).data;

OpenIM.sendMessage({
  recvID: 'recipient user ID',
  groupID: '',
  message,
})
  .then(() => {
    // Message sent successfully ✉️
  })
  .catch(err => {
    // Failed to send message ❌
    console.log(err);
  });

function handleNewMessages({ data }: WSEvent<MessageItem[]>) {
  // New message list 📨
  console.log(data);
}
```

## Examples 🌟

You can find a demo web app that uses the SDK in the [openim-pc-web-demo](https://github.com/openimsdk/open-im-pc-web-demo) repository.

## Browser Support 🌐

| Browser             | Desktop OS            | Mobile OS |
| ------------------- | --------------------- | --------- |
| Chrome (61+)        | Windows, macOS, Linux | Android   |
| Firefox (58+)       | Windows, macOS, Linux | Android   |
| Safari (15+)        | macOS                 | iOS       |
| Edge (Chromium 16+) | Windows, macOS        |           |
