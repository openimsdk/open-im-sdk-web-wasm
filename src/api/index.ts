import { initBackend } from 'open-absurd-sql/dist/indexeddb-main-thread';
import { RPCMessageEvent, RPC, RPCError } from 'rpc-shooter';
import { DatabaseErrorCode } from '@/constant';

let rpc: RPC | undefined;
let worker: Worker | undefined;

function initWorker() {
  if (typeof window === 'undefined') {
    return;
  }

  worker = new Worker(new URL('./worker.js', import.meta.url));
  // This is only required because Safari doesn't support nested
  // workers. This installs a handler that will proxy creating web
  // workers through the main thread
  initBackend(worker);

  rpc = new RPC({
    event: new RPCMessageEvent({
      currentEndpoint: worker,
      targetEndpoint: worker,
    }),
  });
}

function resetWorker() {
  if (rpc) {
    rpc.destroy();
    rpc = undefined;
  }
  if (worker) {
    worker.terminate();
    worker = undefined;
  }
}

initWorker();

function catchErrorHandle(error: unknown) {
  // defined in rpc-shooter
  if ((error as RPCError).code === -32300) {
    resetWorker();

    return JSON.stringify({
      data: '',
      errCode: DatabaseErrorCode.ErrorDBTimeout,
      errMsg: 'database maybe damaged',
    });
  }

  throw error;
}

function registeMethodOnWindow(name: string) {
  console.info(`=> (database api) registe ${name}`);

  return async (...args: unknown[]) => {
    if (!rpc || !worker) {
      initWorker();
    }

    if (!rpc) {
      return;
    }

    try {
      console.info(
        `=> (invoked by go wasm) run ${name} method with args ${JSON.stringify(
          args
        )}`
      );
      const response = await rpc.invoke(name, ...args, { timeout: 5000000 });
      console.info(
        `=> (invoked by go wasm) run ${name} method with response `,
        JSON.stringify(response)
      );

      return JSON.stringify(response);
    } catch (error: unknown) {
      // defined in rpc-shooter
      catchErrorHandle(error);
    }
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
  window.updateColumnsMessage = registeMethodOnWindow('updateColumnsMessage');
  window.insertMessage = registeMethodOnWindow('insertMessage');
  window.batchInsertMessageList = registeMethodOnWindow(
    'batchInsertMessageList'
  );
  window.getMessageList = registeMethodOnWindow('getMessageList');
  window.getMessageListNoTime = registeMethodOnWindow('getMessageListNoTime');
  window.searchAllMessageByContentType = registeMethodOnWindow(
    'searchAllMessageByContentType'
  );

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
  window.getTotalUnreadMsgCountDB = registeMethodOnWindow(
    'getTotalUnreadMsgCountDB'
  );
  window.getTotalUnreadMsgCount = registeMethodOnWindow(
    'getTotalUnreadMsgCount'
  );
  window.resetConversation = registeMethodOnWindow('resetConversation');
  window.setConversationDraft = registeMethodOnWindow('setConversationDraft');
  window.removeConversationDraft = registeMethodOnWindow(
    'removeConversationDraft'
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
  window.superGroupUpdateColumnsMessage = registeMethodOnWindow(
    'superGroupUpdateColumnsMessage'
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
  window.superGroupSearchAllMessageByContentType = registeMethodOnWindow(
    'superGroupSearchAllMessageByContentType'
  );
  window.getMsgSeqListByPeerUserID = registeMethodOnWindow(
    'getMsgSeqListByPeerUserID'
  );
  window.getMsgSeqListBySelfUserID = registeMethodOnWindow(
    'getMsgSeqListBySelfUserID'
  );
  window.getMsgSeqListByGroupID = registeMethodOnWindow(
    'getMsgSeqListByGroupID'
  );
  window.updateMessageStatusBySourceID = registeMethodOnWindow(
    'updateMessageStatusBySourceID'
  );

  // reaction extensions
  window.getMessageReactionExtension = registeMethodOnWindow(
    'getMessageReactionExtension'
  );
  window.insertMessageReactionExtension = registeMethodOnWindow(
    'insertMessageReactionExtension'
  );
  window.getAndUpdateMessageReactionExtension = registeMethodOnWindow(
    'getAndUpdateMessageReactionExtension'
  );
  window.deleteAndUpdateMessageReactionExtension = registeMethodOnWindow(
    'deleteAndUpdateMessageReactionExtension'
  );
  window.getMultipleMessageReactionExtension = registeMethodOnWindow(
    'getMultipleMessageReactionExtension'
  );
  window.updateMessageReactionExtension = registeMethodOnWindow(
    'updateMessageReactionExtension'
  );
  window.deleteMessageReactionExtension = registeMethodOnWindow(
    'deleteMessageReactionExtension'
  );

  // debug
  window.exec = registeMethodOnWindow('exec');
  window.getRowsModified = registeMethodOnWindow('getRowsModified');
  window.exportDB = async () => {
    if (!rpc || !worker) {
      initWorker();
    }

    if (!rpc) {
      return;
    }

    try {
      console.info('=> (invoked by go wasm) run exportDB method ');
      const result = await rpc.invoke('exportDB', undefined, { timeout: 5000 });
      console.info(
        '=> (invoked by go wasm) run exportDB method with response ',
        JSON.stringify(result)
      );
      return result;
    } catch (error: unknown) {
      catchErrorHandle(error);
    }
  };
}

export const workerPromise = rpc?.connect(5000);
