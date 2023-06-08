import { RPC, RPCMessageEvent } from 'rpc-shooter';
import {
  init,
  close,
  // message
  getMessage,
  getMultipleMessage,
  getSendingMessageList,
  getNormalMsgSeq,
  updateMessageTimeAndStatus,
  updateMessage,
  updateColumnsMessage,
  insertMessage,
  batchInsertMessageList,
  getMessageList,
  getMessageListNoTime,
  searchAllMessageByContentType,
  getMsgSeqListByPeerUserID,
  getMsgSeqListBySelfUserID,
  getMsgSeqListByGroupID,
  updateMessageStatusBySourceID,
  getAbnormalMsgSeq,
  getAbnormalMsgSeqList,

  // conversation
  getAllConversationList,
  getAllConversationListToSync,
  getHiddenConversationList,
  getConversation,
  getMultipleConversation,
  updateColumnsConversation,
  decrConversationUnreadCount,
  batchInsertConversationList,
  insertConversation,
  getTotalUnreadMsgCount,
  resetConversation,
  getMultipleConversationDB,

  // users
  getLoginUser,
  insertLoginUser,
  updateLoginUserByMap,

  // super group
  getJoinedSuperGroupList,
  getJoinedSuperGroupIDList,
  getSuperGroupInfoByGroupID,
  deleteSuperGroup,
  insertSuperGroup,
  updateSuperGroup,

  // unread messages
  deleteConversationUnreadMessageList,
  batchInsertConversationUnreadMessageList,

  // super group messages
  superGroupGetMessage,
  superGroupGetMultipleMessage,
  getSuperGroupNormalMsgSeq,
  superGroupGetNormalMinSeq,
  superGroupUpdateMessageTimeAndStatus,
  superGroupUpdateMessage,
  superGroupInsertMessage,
  superGroupBatchInsertMessageList,
  superGroupGetMessageListNoTime,
  superGroupGetMessageList,
  superGroupUpdateColumnsMessage,
  superGroupSearchAllMessageByContentType,
  getSuperGroupAbnormalMsgSeq,
  superGroupGetAlreadyExistSeqList,
  superBatchInsertExceptionMsg,

  // group request
  getSendGroupApplication,
  getAdminGroupApplication,

  // blacks
  getBlackList,

  // group
  getJoinedGroupList,
  getJoinedWorkingGroupIDList,

  // friend request
  getRecvFriendApplication,
  getSendFriendApplication,

  // friend
  getAllFriendList,
} from '@/api/database';

import { getInstance } from './database/instance';

import {
  deleteAndUpdateMessageReactionExtension,
  getAndUpdateMessageReactionExtension,
  getMessageReactionExtension,
  insertMessageReactionExtension,
  getMultipleMessageReactionExtension,
  updateMessageReactionExtension,
  deleteMessageReactionExtension,
} from '@/api/database/reactionExtension';

const ctx = self;
const rpc = new RPC({
  event: new RPCMessageEvent({
    currentEndpoint: ctx,
    targetEndpoint: ctx,
  }),
});

rpc.registerMethod('initDB', init);
rpc.registerMethod('close', close);

//message
rpc.registerMethod('getMessage', getMessage);
rpc.registerMethod('getMultipleMessage', getMultipleMessage);
rpc.registerMethod('getSendingMessageList', getSendingMessageList);
rpc.registerMethod('getNormalMsgSeq', getNormalMsgSeq);
rpc.registerMethod('updateMessageTimeAndStatus', updateMessageTimeAndStatus);
rpc.registerMethod('updateMessage', updateMessage);
rpc.registerMethod('updateColumnsMessage', updateColumnsMessage);
rpc.registerMethod('insertMessage', insertMessage);
rpc.registerMethod('batchInsertMessageList', batchInsertMessageList);
rpc.registerMethod(
  'superGroupGetMessageListNoTime',
  superGroupGetMessageListNoTime
);
rpc.registerMethod('getMessageList', getMessageList);
rpc.registerMethod('getMessageListNoTime', getMessageListNoTime);
rpc.registerMethod(
  'searchAllMessageByContentType',
  searchAllMessageByContentType
);
rpc.registerMethod('getMsgSeqListByPeerUserID', getMsgSeqListByPeerUserID);
rpc.registerMethod('getMsgSeqListBySelfUserID', getMsgSeqListBySelfUserID);
rpc.registerMethod('getMsgSeqListByGroupID', getMsgSeqListByGroupID);
rpc.registerMethod(
  'updateMessageStatusBySourceID',
  updateMessageStatusBySourceID
);
rpc.registerMethod('getAbnormalMsgSeq', getAbnormalMsgSeq);
rpc.registerMethod('getAbnormalMsgSeqList', getAbnormalMsgSeqList);
// conversation
rpc.registerMethod('getAllConversationList', getAllConversationList);
rpc.registerMethod(
  'getAllConversationListToSync',
  getAllConversationListToSync
);
rpc.registerMethod('getHiddenConversationList', getHiddenConversationList);
rpc.registerMethod('getConversation', getConversation);
rpc.registerMethod('getMultipleConversation', getMultipleConversation);
rpc.registerMethod('updateColumnsConversation', updateColumnsConversation);
rpc.registerMethod('decrConversationUnreadCount', decrConversationUnreadCount);
rpc.registerMethod('batchInsertConversationList', batchInsertConversationList);
rpc.registerMethod('getTotalUnreadMsgCount', getTotalUnreadMsgCount);
rpc.registerMethod('getTotalUnreadMsgCountDB', getTotalUnreadMsgCount);
rpc.registerMethod('insertConversation', insertConversation);
rpc.registerMethod('getMultipleConversationDB', getMultipleConversationDB);

// users
rpc.registerMethod('getLoginUser', getLoginUser);
rpc.registerMethod('insertLoginUser', insertLoginUser);
rpc.registerMethod('updateLoginUserByMap', updateLoginUserByMap);
rpc.registerMethod('resetConversation', resetConversation);

// super group
rpc.registerMethod('getJoinedSuperGroupList', getJoinedSuperGroupList);
rpc.registerMethod('getJoinedSuperGroupIDList', getJoinedSuperGroupIDList);
rpc.registerMethod('getSuperGroupInfoByGroupID', getSuperGroupInfoByGroupID);
rpc.registerMethod('deleteSuperGroup', deleteSuperGroup);
rpc.registerMethod('insertSuperGroup', insertSuperGroup);
rpc.registerMethod('updateSuperGroup', updateSuperGroup);

// unread messages
rpc.registerMethod(
  'deleteConversationUnreadMessageList',
  deleteConversationUnreadMessageList
);
rpc.registerMethod(
  'batchInsertConversationUnreadMessageList',
  batchInsertConversationUnreadMessageList
);

// super group messages
rpc.registerMethod('superGroupGetMessage', superGroupGetMessage);
rpc.registerMethod(
  'superGroupGetMultipleMessage',
  superGroupGetMultipleMessage
);
rpc.registerMethod('getSuperGroupNormalMsgSeq', getSuperGroupNormalMsgSeq);
rpc.registerMethod('superGroupGetNormalMinSeq', superGroupGetNormalMinSeq);

rpc.registerMethod(
  'superGroupUpdateMessageTimeAndStatus',
  superGroupUpdateMessageTimeAndStatus
);
rpc.registerMethod('superGroupUpdateMessage', superGroupUpdateMessage);
rpc.registerMethod('superGroupInsertMessage', superGroupInsertMessage);
rpc.registerMethod(
  'superGroupBatchInsertMessageList',
  superGroupBatchInsertMessageList
);
rpc.registerMethod('superGroupGetMessageList', superGroupGetMessageList);
rpc.registerMethod(
  'superGroupUpdateColumnsMessage',
  superGroupUpdateColumnsMessage
);
rpc.registerMethod(
  'superGroupSearchAllMessageByContentType',
  superGroupSearchAllMessageByContentType
);
rpc.registerMethod('getSuperGroupAbnormalMsgSeq', getSuperGroupAbnormalMsgSeq);
rpc.registerMethod(
  'superGroupGetAlreadyExistSeqList',
  superGroupGetAlreadyExistSeqList
);
rpc.registerMethod(
  'superBatchInsertExceptionMsg',
  superBatchInsertExceptionMsg
);

rpc.registerMethod('exec', async (sql: string) => {
  const db = await getInstance();

  try {
    const result = db.exec(sql);

    console.info(`sql debug with exec sql = ${sql.trim()} , return `, result);
  } catch (error) {
    console.info(`sql debug with exec sql = ${sql} , return `, error);
  }
});
rpc.registerMethod('getRowsModified', async () => {
  const db = await getInstance();

  try {
    const result = db.getRowsModified();

    console.info('sql debug with getRowsModified return ', result);
  } catch (error) {
    console.info('sql debug with getRowsModified return ', error);
  }
});

rpc.registerMethod('exportDB', async () => {
  const db = await getInstance();

  try {
    const data = db.export();
    const blob = new Blob([data]);
    const blobHref = URL.createObjectURL(blob);

    return blobHref;
  } catch (error) {
    console.info('sql export error, return ', error);
  }
});

// reaction extensions
rpc.registerMethod('getMessageReactionExtension', getMessageReactionExtension);
rpc.registerMethod(
  'insertMessageReactionExtension',
  insertMessageReactionExtension
);
rpc.registerMethod(
  'getAndUpdateMessageReactionExtension',
  getAndUpdateMessageReactionExtension
);
rpc.registerMethod(
  'deleteAndUpdateMessageReactionExtension',
  deleteAndUpdateMessageReactionExtension
);
rpc.registerMethod(
  'getMultipleMessageReactionExtension',
  getMultipleMessageReactionExtension
);
rpc.registerMethod(
  'deleteMessageReactionExtension',
  deleteMessageReactionExtension
);
rpc.registerMethod(
  'updateMessageReactionExtension',
  updateMessageReactionExtension
);

// group request
rpc.registerMethod('getSendGroupApplication', getSendGroupApplication);
rpc.registerMethod('getAdminGroupApplication', getAdminGroupApplication);

// blacks
rpc.registerMethod('getBlackList', getBlackList);

// group
rpc.registerMethod('getJoinedGroupList', getJoinedGroupList);
rpc.registerMethod('getJoinedWorkingGroupIDList', getJoinedWorkingGroupIDList);

// friend request
rpc.registerMethod('getRecvFriendApplication', getRecvFriendApplication);
rpc.registerMethod('getSendFriendApplication', getSendFriendApplication);

// friend
rpc.registerMethod('getAllFriendList', getAllFriendList);
