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

function registerMethodOnWindow(name: string) {
  console.info(`=> (database api) register ${name}`);

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

  window.initDB = registerMethodOnWindow('initDB');
  window.close = registerMethodOnWindow('close');

  // message
  window.getMessage = registerMethodOnWindow('getMessage');
  window.getMultipleMessage = registerMethodOnWindow('getMultipleMessage');
  window.getSendingMessageList = registerMethodOnWindow(
    'getSendingMessageList'
  );
  window.getNormalMsgSeq = registerMethodOnWindow('getNormalMsgSeq');
  window.updateMessageTimeAndStatus = registerMethodOnWindow(
    'updateMessageTimeAndStatus'
  );
  window.updateMessage = registerMethodOnWindow('updateMessage');
  window.updateColumnsMessage = registerMethodOnWindow('updateColumnsMessage');
  window.insertMessage = registerMethodOnWindow('insertMessage');
  window.batchInsertMessageList = registerMethodOnWindow(
    'batchInsertMessageList'
  );
  window.getMessageList = registerMethodOnWindow('getMessageList');
  window.getMessageListNoTime = registerMethodOnWindow('getMessageListNoTime');
  window.searchAllMessageByContentType = registerMethodOnWindow(
    'searchAllMessageByContentType'
  );
  window.getAbnormalMsgSeq = registerMethodOnWindow('getAbnormalMsgSeq');
  window.getAbnormalMsgSeqList = registerMethodOnWindow(
    'getAbnormalMsgSeqList'
  );

  // conversation
  window.getAllConversationListDB = registerMethodOnWindow(
    'getAllConversationList'
  );
  window.getAllConversationListToSync = registerMethodOnWindow(
    'getAllConversationListToSync'
  );
  window.getHiddenConversationList = registerMethodOnWindow(
    'getHiddenConversationList'
  );
  window.getConversation = registerMethodOnWindow('getConversation');
  window.getMultipleConversation = registerMethodOnWindow(
    'getMultipleConversation'
  );
  window.updateColumnsConversation = registerMethodOnWindow(
    'updateColumnsConversation'
  );
  window.updateConversation = registerMethodOnWindow(
    'updateColumnsConversation'
  );
  window.updateConversationForSync = registerMethodOnWindow(
    'updateColumnsConversation'
  );
  window.decrConversationUnreadCount = registerMethodOnWindow(
    'decrConversationUnreadCount'
  );
  window.batchInsertConversationList = registerMethodOnWindow(
    'batchInsertConversationList'
  );
  window.insertConversation = registerMethodOnWindow('insertConversation');
  window.getTotalUnreadMsgCountDB = registerMethodOnWindow(
    'getTotalUnreadMsgCountDB'
  );
  window.getTotalUnreadMsgCount = registerMethodOnWindow(
    'getTotalUnreadMsgCount'
  );
  window.resetConversation = registerMethodOnWindow('resetConversation');

  // users
  window.getLoginUser = registerMethodOnWindow('getLoginUser');
  window.insertLoginUser = registerMethodOnWindow('insertLoginUser');
  window.updateLoginUserByMap = registerMethodOnWindow('updateLoginUserByMap');

  // super groups
  window.getJoinedSuperGroupList = registerMethodOnWindow(
    'getJoinedSuperGroupList'
  );
  window.getJoinedSuperGroupIDList = registerMethodOnWindow(
    'getJoinedSuperGroupIDList'
  );
  window.getSuperGroupInfoByGroupID = registerMethodOnWindow(
    'getSuperGroupInfoByGroupID'
  );
  window.deleteSuperGroup = registerMethodOnWindow('deleteSuperGroup');
  window.insertSuperGroup = registerMethodOnWindow('insertSuperGroup');
  window.updateSuperGroup = registerMethodOnWindow('updateSuperGroup');
  window.getJoinedWorkingGroupIDList = registerMethodOnWindow(
    'getJoinedWorkingGroupIDList'
  );

  // unread messages
  window.deleteConversationUnreadMessageList = registerMethodOnWindow(
    'deleteConversationUnreadMessageList'
  );
  window.batchInsertConversationUnreadMessageList = registerMethodOnWindow(
    'batchInsertConversationUnreadMessageList'
  );

  // super group messages
  window.superGroupGetMessage = registerMethodOnWindow('superGroupGetMessage');
  window.superGroupGetMultipleMessage = registerMethodOnWindow(
    'superGroupGetMultipleMessage'
  );
  window.superGroupGetNormalMinSeq = registerMethodOnWindow(
    'superGroupGetNormalMinSeq'
  );
  window.getSuperGroupNormalMsgSeq = registerMethodOnWindow(
    'getSuperGroupNormalMsgSeq'
  );
  window.superGroupUpdateMessageTimeAndStatus = registerMethodOnWindow(
    'superGroupUpdateMessageTimeAndStatus'
  );
  window.superGroupUpdateMessage = registerMethodOnWindow(
    'superGroupUpdateMessage'
  );
  window.superGroupInsertMessage = registerMethodOnWindow(
    'superGroupInsertMessage'
  );
  window.superGroupUpdateColumnsMessage = registerMethodOnWindow(
    'superGroupUpdateColumnsMessage'
  );
  window.superGroupBatchInsertMessageList = registerMethodOnWindow(
    'superGroupBatchInsertMessageList'
  );
  window.superGroupGetMessageListNoTime = registerMethodOnWindow(
    'superGroupGetMessageListNoTime'
  );
  window.superGroupGetMessageList = registerMethodOnWindow(
    'superGroupGetMessageList'
  );
  window.superGroupSearchAllMessageByContentType = registerMethodOnWindow(
    'superGroupSearchAllMessageByContentType'
  );
  window.getMsgSeqListByPeerUserID = registerMethodOnWindow(
    'getMsgSeqListByPeerUserID'
  );
  window.getMsgSeqListBySelfUserID = registerMethodOnWindow(
    'getMsgSeqListBySelfUserID'
  );
  window.getMsgSeqListByGroupID = registerMethodOnWindow(
    'getMsgSeqListByGroupID'
  );
  window.updateMessageStatusBySourceID = registerMethodOnWindow(
    'updateMessageStatusBySourceID'
  );
  window.superGroupGetAlreadyExistSeqList = registerMethodOnWindow(
    'superGroupGetAlreadyExistSeqList'
  );

  // super group error chat logs
  window.getSuperGroupAbnormalMsgSeq = registerMethodOnWindow(
    'getSuperGroupAbnormalMsgSeq'
  );

  window.superBatchInsertExceptionMsg = registerMethodOnWindow(
    'superBatchInsertExceptionMsg'
  );

  // reaction extensions
  window.getMessageReactionExtension = registerMethodOnWindow(
    'getMessageReactionExtension'
  );
  window.insertMessageReactionExtension = registerMethodOnWindow(
    'insertMessageReactionExtension'
  );
  window.getAndUpdateMessageReactionExtension = registerMethodOnWindow(
    'getAndUpdateMessageReactionExtension'
  );
  window.deleteAndUpdateMessageReactionExtension = registerMethodOnWindow(
    'deleteAndUpdateMessageReactionExtension'
  );
  window.getMultipleMessageReactionExtension = registerMethodOnWindow(
    'getMultipleMessageReactionExtension'
  );
  window.updateMessageReactionExtension = registerMethodOnWindow(
    'updateMessageReactionExtension'
  );
  window.deleteMessageReactionExtension = registerMethodOnWindow(
    'deleteMessageReactionExtension'
  );

  // group request
  window.getSendGroupApplication = registerMethodOnWindow(
    'getSendGroupApplication'
  );
  window.getAdminGroupApplication = registerMethodOnWindow(
    'getAdminGroupApplication'
  );

  // blacks
  window.getBlackListDB = registerMethodOnWindow('getBlackList');

  // group
  window.getJoinedGroupListDB = registerMethodOnWindow('getJoinedGroupList');

  // friend request
  window.getRecvFriendApplication = registerMethodOnWindow(
    'getRecvFriendApplication'
  );
  window.getSendFriendApplication = registerMethodOnWindow(
    'getSendFriendApplication'
  );

  // friend
  window.getAllFriendList = registerMethodOnWindow('getAllFriendList');

  // debug
  window.exec = registerMethodOnWindow('exec');
  window.getRowsModified = registerMethodOnWindow('getRowsModified');
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
