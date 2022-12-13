import { DatabaseErrorCode, MessageType } from '@/constant';
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
  searchAllMessageByContentType as databaseSearchAllMessageByContentType,
  getMsgSeqListByPeerUserID as databaseGetMsgSeqListByPeerUserID,
  getMsgSeqListBySelfUserID as databaseGetMsgSeqListBySelfUserID,
  getMsgSeqListByGroupID as databaseGetMsgSeqListByGroupID,
  updateMessageStatusBySourceID as databaseUpdateMessageStatusBySourceID,
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
  messageIds: string[]
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMultipleMessage(db, messageIds);

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

export async function updateColumnsMessage(
  clientMsgId: string,
  messageStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseUpdateMessage(
      db,
      clientMsgId,
      JSON.parse(messageStr) as ClientMessage
    );
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
  loginUserID = ''
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

export async function searchAllMessageByContentType(
  contentType: MessageType
): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseSearchAllMessageByContentType(db, contentType);
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
export async function getMsgSeqListByPeerUserID(
  userID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqListByPeerUserID(db, userID);
    const converedResult = converSqlExecResult(execResult[0], 'CamelCase');

    return formatResponse(
      converedResult.map(item => {
        return item.seq;
      })
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

export async function getMsgSeqListBySelfUserID(
  userID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqListBySelfUserID(db, userID);

    const converedResult = converSqlExecResult(execResult[0], 'CamelCase');

    return formatResponse(
      converedResult.map(item => {
        return item.seq;
      })
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

export async function getMsgSeqListByGroupID(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMsgSeqListByGroupID(db, groupID);
    const converedResult = converSqlExecResult(execResult[0], 'CamelCase');

    return formatResponse(
      converedResult.map(item => {
        return item.seq;
      })
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

export async function updateMessageStatusBySourceID(
  sourceID: string,
  status: number,
  sessionType: number,
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    databaseUpdateMessageStatusBySourceID(
      db,
      sourceID,
      status,
      sessionType,
      loginUserID
    );

    const modifed = db.getRowsModified();
    if (modifed === 0) {
      // throw 'updateMessageStatusBySourceID no record updated';
    }

    return formatResponse(modifed);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
