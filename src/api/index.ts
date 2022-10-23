import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import { RPCMessageEvent, RPC } from 'rpc-shooter';

function init() {
  if (typeof window === 'undefined') {
    return;
  }

  const worker = new Worker(new URL('./worker.js', import.meta.url));
  // This is only required because Safari doesn't support nested
  // workers. This installs a handler that will proxy creating web
  // workers through the main thread
  initBackend(worker);

  const rpc = new RPC({
    event: new RPCMessageEvent({
      currentEndpoint: worker,
      targetEndpoint: worker,
    }),
  });

  return rpc;
}

const rpc = init();

function registeMethodOnWindow(name: string) {
  console.info(`=> (database api) registe ${name}`);

  return async (...args: unknown[]) => {
    if (!rpc) {
      return;
    }

    console.info(
      `=> (invoked by go wasm) run ${name} method with args ${JSON.stringify(
        args
      )}`
    );
    const response = await rpc.invoke(name, ...args);
    console.info(
      `=> (invoked by go wasm) run ${name} method with response `,
      JSON.stringify(response)
    );

    return JSON.stringify(response);
  };
}

// register method on window for go wasm invoke
export function initDatabaseAPI(): void {
  if (!rpc) {
    return;
  }

  window.initDB = registeMethodOnWindow('initDB');
  window.close = registeMethodOnWindow('close');

  // message
  window.getMessage = registeMethodOnWindow('getMessage');
  window.getMultipleMessage = registeMethodOnWindow('getMultipleMessage');
  window.getSendingMessageList = registeMethodOnWindow('getSendingMessageList');
  window.getNormalMsgSeq = registeMethodOnWindow('getNormalMsgSeq');
  window.updateMessageTimeAndStatus = registeMethodOnWindow(
    'updateMessageTimeAndStatus'
  );
  window.updateMessage = registeMethodOnWindow('updateMessage');
  window.insertMessage = registeMethodOnWindow('insertMessage');
  window.batchInsertMessageList = registeMethodOnWindow(
    'batchInsertMessageList'
  );
  window.getMessageList = registeMethodOnWindow('getMessageList');
  window.getMessageListNoTime = registeMethodOnWindow('getMessageListNoTime');

  // conversation
  window.getAllConversationListDB = registeMethodOnWindow(
    'getAllConversationList'
  );
  window.getAllConversationListToSync = registeMethodOnWindow(
    'getAllConversationListToSync'
  );
  window.getHiddenConversationList = registeMethodOnWindow(
    'getHiddenConversationList'
  );
  window.getConversation = registeMethodOnWindow('getConversation');
  window.getMultipleConversation = registeMethodOnWindow(
    'getMultipleConversation'
  );
  window.updateColumnsConversation = registeMethodOnWindow(
    'updateColumnsConversation'
  );
  window.updateConversation = registeMethodOnWindow(
    'updateColumnsConversation'
  );
  window.updateConversationForSync = registeMethodOnWindow(
    'updateColumnsConversation'
  );
  window.decrConversationUnreadCount = registeMethodOnWindow(
    'decrConversationUnreadCount'
  );
  window.batchInsertConversationList = registeMethodOnWindow(
    'batchInsertConversationList'
  );
  window.insertConversation = registeMethodOnWindow('insertConversation');
  window.getTotalUnreadMsgCount = registeMethodOnWindow(
    'getTotalUnreadMsgCount'
  );

  // users
  window.getLoginUser = registeMethodOnWindow('getLoginUser');
  window.insertLoginUser = registeMethodOnWindow('insertLoginUser');
  window.updateLoginUserByMap = registeMethodOnWindow('updateLoginUserByMap');

  // super groups
  window.getJoinedSuperGroupList = registeMethodOnWindow(
    'getJoinedSuperGroupList'
  );
  window.getJoinedSuperGroupIDList = registeMethodOnWindow(
    'getJoinedSuperGroupIDList'
  );
  window.getSuperGroupInfoByGroupID = registeMethodOnWindow(
    'getSuperGroupInfoByGroupID'
  );
  window.deleteSuperGroup = registeMethodOnWindow('deleteSuperGroup');
  window.insertSuperGroup = registeMethodOnWindow('insertSuperGroup');
  window.updateSuperGroup = registeMethodOnWindow('updateSuperGroup');

  // unread messages
  window.deleteConversationUnreadMessageList = registeMethodOnWindow(
    'deleteConversationUnreadMessageList'
  );
  window.batchInsertConversationUnreadMessageList = registeMethodOnWindow(
    'batchInsertConversationUnreadMessageList'
  );

  // super group messages
  window.superGroupGetMessage = registeMethodOnWindow('superGroupGetMessage');
  window.superGroupGetMultipleMessage = registeMethodOnWindow(
    'superGroupGetMultipleMessage'
  );
  window.superGroupGetNormalMinSeq = registeMethodOnWindow(
    'superGroupGetNormalMinSeq'
  );
  window.getSuperGroupNormalMsgSeq = registeMethodOnWindow(
    'getSuperGroupNormalMsgSeq'
  );
  window.superGroupUpdateMessageTimeAndStatus = registeMethodOnWindow(
    'superGroupUpdateMessageTimeAndStatus'
  );
  window.superGroupUpdateMessage = registeMethodOnWindow(
    'superGroupUpdateMessage'
  );
  window.superGroupInsertMessage = registeMethodOnWindow(
    'superGroupInsertMessage'
  );
  window.superGroupBatchInsertMessageList = registeMethodOnWindow(
    'superGroupBatchInsertMessageList'
  );
  window.superGroupGetMessageListNoTime = registeMethodOnWindow(
    'superGroupGetMessageListNoTime'
  );
  window.superGroupGetMessageList = registeMethodOnWindow(
    'superGroupGetMessageList'
  );

  // debug
  window.exec = registeMethodOnWindow('exec');
  window.getRowsModified = registeMethodOnWindow('getRowsModified');
}
