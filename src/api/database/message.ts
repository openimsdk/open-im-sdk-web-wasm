import { DatabaseErrorCode } from '@/constant';
import {
  ClientMessage,
  getMessage as databaseGetMessage,
  getMultipleMessage as databaseGetMultipleMessage,
  getSendingMessageList as databaseGetSendingMessageList,
  getNormalMsgSeq as databaseGetNormalMsgSeq,
  updateMessageTimeAndStatus as databaseUpdateMessageTimeAndStatus,
  updateMessage as databaseUpdateMessage,
  insertMessage as databaseAddMessage,
  batchInsertMessageList as databaseBatchInsertMessageList,
  getMessageList as databaseGetMesageList,
  getMessageListNoTime as databaseGetMessageListNoTime,
  messageIfExists as databaseMessageIfExists,
  isExistsInErrChatLogBySeq as databaseIsExistsInErrChatLogBySeq,
  messageIfExistsBySeq as databaseMessageIfExistsBySeq,
  getAbnormalMsgSeq as databaseGetAbnormalMsgSeq,
  getAbnormalMsgSeqList as databaseGetAbnormalMsgSeqList,
  batchInsertExceptionMsg as databaseBatchInsertExceptionMsg,
  searchMessageByKeyword as databaseSearchMessageByKeyword,
  searchMessageByContentType as databaseSearchMessageByContentType,
  searchMessageByContentTypeAndKeyword as databaseSearchMessageByContentTypeAndKeyword,
  updateMsgSenderNickname as databaseUpdateMsgSenderNickname,
  updateMsgSenderFaceURL as databaseUpdateMsgSenderFaceURL,
  updateMsgSenderFaceURLAndSenderNickname as databaseUpdateMsgSenderFaceURLAndSenderNickname,
  getMsgSeqByClientMsgID as databaseGetMsgSeqByClientMsgID,
  getMsgSeqListByGroupID as databaseGetMsgSeqListByGroupID,
  getMsgSeqListByPeerUserID as databaseGetMsgSeqListByPeerUserID,
  getMsgSeqListBySelfUserID as databaseGetMsgSeqListBySelfUserID,
  deleteAllMessage as databaseDeleteAllMessage,
  getAllUnDeleteMessageSeqList as databaseGetAllUnDeleteMessageSeqList,
  updateSingleMessageHasRead as databaseUpdateSingleMessageHasRead,
  updateGroupMessageHasRead as databaseUpdateGroupMessageHasRead,
  setMultipleConversationRecvMsgOpt as databaseSetMultipleConversationRecvMsgOpt,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { getInstance } from './instance';

export async function getMessage(messageId: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMessage(db, messageId);

    if (execResult.length === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `no message with id ${messageId}`
      );
    }

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])[0]
    );
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMultipleMessage(
  messageIDStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMultipleMessage(db, JSON.parse(messageIDStr));

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
    );
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getSendingMessageList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetSendingMessageList(db);

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
    );
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getNormalMsgSeq(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetNormalMsgSeq(db);

    return formatResponse(execResult[0]?.values[0]?.[0]);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateMessageTimeAndStatus(
  clientMsgID: string,
  serverMsgID: string,
  sendTime: number,
  status: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseUpdateMessageTimeAndStatus(
      db,
      clientMsgID,
      serverMsgID,
      sendTime,
      status
    );

    return formatResponse(execResult);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateMessage(
  clientMsgId: string,
  messageStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const message = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(messageStr), { groupName: 'name' })
    ) as ClientMessage;

    const execResult = databaseUpdateMessage(db, clientMsgId, message);
    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'updateMessage no record updated';
    }

    return formatResponse(execResult);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function insertMessage(messageStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const message = convertToSnakeCaseObject(
      JSON.parse(messageStr)
    ) as ClientMessage;

    const execResult = databaseAddMessage(db, message);

    return formatResponse(execResult);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function batchInsertMessageList(
  messageListStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const messageList = (JSON.parse(messageListStr) as ClientMessage[]).map(
      (v: Record<string, unknown>) => convertToSnakeCaseObject(v)
    );

    const execResult = databaseBatchInsertMessageList(db, messageList);

    return formatResponse(execResult);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMessageListNoTime(
  sourceID: string,
  sessionType: number,
  count: number,
  isReverse = false,
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMessageListNoTime(
      db,
      sourceID,
      sessionType,
      count,
      isReverse,
      loginUserID
    );

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
    );
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMessageList(
  sourceID: string,
  sessionType: number,
  count: number,
  startTime: number,
  isReverse = false,
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMesageList(
      db,
      sourceID,
      sessionType,
      count,
      startTime,
      isReverse,
      loginUserID
    );

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
    );
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function messageIfExists(clientMsgID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseMessageIfExists(db, clientMsgID);

    return formatResponse(execResult.length !== 0);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function isExistsInErrChatLogBySeq(seq: number): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseIsExistsInErrChatLogBySeq(db, seq);

    return formatResponse(execResult.length !== 0);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function messageIfExistsBySeq(seq: number): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseMessageIfExistsBySeq(db, seq);

    return formatResponse(execResult.length !== 0);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getAbnormalMsgSeq(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetAbnormalMsgSeq(db);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getAbnormalMsgSeqList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetAbnormalMsgSeqList(db);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function batchInsertExceptionMsg(
  messageListStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const messageList = (JSON.parse(messageListStr) as ClientMessage[]).map(
      (v: Record<string, unknown>) => convertToSnakeCaseObject(v)
    );

    const execResult = databaseBatchInsertExceptionMsg(db, messageList);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function searchMessageByKeyword(
  contentType: number[],
  keywordList: string[],
  keywordListMatchType: number,
  sourceID: string,
  startTime: number,
  endTime: number,
  sessionType: number,
  offset: number,
  count: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSearchMessageByKeyword(
      db,
      contentType,
      keywordList,
      keywordListMatchType,
      sourceID,
      startTime,
      endTime,
      sessionType,
      offset,
      count
    );

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function searchMessageByContentType(
  contentTypeStr: string,
  sourceID: string,
  startTime: number,
  endTime: number,
  sessionType: number,
  offset: number,
  count: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSearchMessageByContentType(
      db,
      JSON.parse(contentTypeStr),
      sourceID,
      startTime,
      endTime,
      sessionType,
      offset,
      count
    );

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function searchMessageByContentTypeAndKeyword(
  contentTypeStr: string,
  keywordListStr: string,
  keywordListMatchType: number,
  startTime: number,
  endTime: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSearchMessageByContentTypeAndKeyword(
      db,
      JSON.parse(contentTypeStr),
      JSON.parse(keywordListStr),
      keywordListMatchType,
      startTime,
      endTime
    );

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateMsgSenderNickname(
  sendID: string,
  nickname: string,
  sessionType: number
): Promise<string> {
  try {
    const db = await getInstance();

    databaseUpdateMsgSenderNickname(db, sendID, nickname, sessionType);

    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateMsgSenderFaceURL(
  sendID: string,
  faceURL: string,
  sessionType: number
): Promise<string> {
  try {
    const db = await getInstance();

    databaseUpdateMsgSenderFaceURL(db, sendID, faceURL, sessionType);

    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateMsgSenderFaceURLAndSenderNickname(
  sendID: string,
  faceURL: string,
  nickname: string,
  sessionType: number
): Promise<string> {
  try {
    const db = await getInstance();

    databaseUpdateMsgSenderFaceURLAndSenderNickname(
      db,
      sendID,
      faceURL,
      nickname,
      sessionType
    );

    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMsgSeqByClientMsgID(
  clientMsgID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqByClientMsgID(db, clientMsgID);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMsgSeqListByGroupID(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqListByGroupID(db, groupID);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMsgSeqListByPeerUserID(
  userID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqListByPeerUserID(db, userID);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getMsgSeqListBySelfUserID(
  userID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqListBySelfUserID(db, userID);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function deleteAllMessage(): Promise<string> {
  try {
    const db = await getInstance();

    databaseDeleteAllMessage(db);

    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getAllUnDeleteMessageSeqList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetAllUnDeleteMessageSeqList(db);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateSingleMessageHasRead(
  sendID: string,
  clientMsgIDListStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    databaseUpdateSingleMessageHasRead(
      db,
      sendID,
      JSON.parse(clientMsgIDListStr)
    );

    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function updateGroupMessageHasRead(
  clientMsgIDListStr: string,
  sessionType: number
): Promise<string> {
  try {
    const db = await getInstance();

    databaseUpdateGroupMessageHasRead(
      db,
      JSON.parse(clientMsgIDListStr),
      sessionType
    );

    return formatResponse('');
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
