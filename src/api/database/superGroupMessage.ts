import { DatabaseErrorCode } from '@/constant';
import {
  ClientSuperGroupMessage,
  superGroupGetMessage as databaseSuperGroupGetMessage,
  superGroupGetMultipleMessage as databaseSuperGroupGetMultipleMessage,
  getSuperGroupNormalMsgSeq as databaseGetSuperGroupNormalMsgSeq,
  superGroupGetNormalMinSeq as databaseSuperGroupGetNormalMinSeq,
  superGroupUpdateMessageTimeAndStatus as databaseSuperGroupUpdateMessageTimeAndStatus,
  superGroupUpdateMessage as databaseSuperGroupUpdateMessage,
  superGroupInsertMessage as databaseSuperGroupInsertMessage,
  superGroupBatchInsertMessageList as databaseSuperGroupBatchInsertMessageList,
  superGroupGetMessageListNoTime as databaseSuperGroupGetMessageListNoTime,
  superGroupGetMessageList as databaseSuperGroupGetMessageList,
  superGroupDeleteAllMessage as databaseSuperGroupDeleteAllMessage,
  superGroupSearchMessageByKeyword as databaseSuperGroupSearchMessageByKeyword,
  superGroupSearchMessageByContentType as databaseSuperGroupSearchMessageByContentType,
  superGroupSearchMessageByContentTypeAndKeyword as databaseSuperGroupSearchMessageByContentTypeAndKeyword,
  superGroupUpdateMessageStatusBySourceID as databaseSuperGroupUpdateMessageStatusBySourceID,
  superGroupGetSendingMessageList as databaseSuperGroupGetSendingMessageList,
  superGroupUpdateGroupMessageHasRead as databaseSuperGroupUpdateGroupMessageHasRead,
  superGroupGetMsgSeqByClientMsgID as databaseSuperGroupGetMsgSeqByClientMsgID,
  superGroupUpdateMsgSenderFaceURLAndSenderNickname as databaseSuperGroupUpdateMsgSenderFaceURLAndSenderNickname,
  superGroupSearchAllMessageByContentType as databaseSuperGroupSearchAllMessageByContentType,
} from '@/sqls';
import {
  converSqlExecResult,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { getInstance } from './instance';

export async function superGroupGetMessage(
  groupID: string,
  messageId: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupGetMessage(db, groupID, messageId);

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

export async function superGroupGetMultipleMessage(
  messageIdsStr: string,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();
    const messageIds = JSON.parse(messageIdsStr || '[]') as string[];

    const execResult = databaseSuperGroupGetMultipleMessage(
      db,
      groupID,
      messageIds
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

export async function getSuperGroupNormalMsgSeq(
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetSuperGroupNormalMsgSeq(db, groupID);

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

export async function superGroupGetNormalMinSeq(
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupGetNormalMinSeq(db, groupID);

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

export async function superGroupUpdateMessageTimeAndStatus(
  groupID: string,
  clientMsgID: string,
  serverMsgID: string,
  sendTime: number,
  status: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupUpdateMessageTimeAndStatus(
      db,
      groupID,
      clientMsgID,
      serverMsgID,
      sendTime,
      status
    );

    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'superGroupUpdateMessageTimeAndStatus no record updated';
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

export async function superGroupUpdateMessage(
  groupID: string,
  clientMsgID: string,
  messageStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const message = convertToSnakeCaseObject(
      JSON.parse(messageStr) as ClientSuperGroupMessage
    );

    const execResult = databaseSuperGroupUpdateMessage(
      db,
      groupID,
      clientMsgID,
      message
    );

    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'superGroupUpdateMessage no record updated';
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

export async function superGroupUpdateColumnsMessage(
  clientMsgID: string,
  groupID: string,
  messageStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const message = convertToSnakeCaseObject(
      JSON.parse(messageStr) as ClientSuperGroupMessage
    );

    const execResult = databaseSuperGroupUpdateMessage(
      db,
      groupID,
      clientMsgID,
      message
    );

    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'superGroupUpdateColumnsMessage no record updated';
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

export async function superGroupInsertMessage(
  messageStr: string,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();
    const message = convertToSnakeCaseObject(
      JSON.parse(messageStr)
    ) as ClientSuperGroupMessage;

    const execResult = databaseSuperGroupInsertMessage(db, groupID, message);

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

export async function superGroupBatchInsertMessageList(
  messageListStr: string,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();
    const messageList = (
      JSON.parse(messageListStr) as ClientSuperGroupMessage[]
    ).map((v: Record<string, unknown>) => convertToSnakeCaseObject(v));

    const execResult = databaseSuperGroupBatchInsertMessageList(
      db,
      groupID,
      messageList
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

export async function superGroupGetMessageListNoTime(
  groupID: string,
  sessionType: number,
  count: number,
  isReverse = false
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupGetMessageListNoTime(
      db,
      groupID,
      sessionType,
      count,
      isReverse
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

export async function superGroupGetMessageList(
  groupID: string,
  sessionType: number,
  count: number,
  startTime: number,
  isReverse = false
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupGetMessageList(
      db,
      groupID,
      sessionType,
      count,
      startTime,
      isReverse
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

export async function superGroupDeleteAllMessage(
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupDeleteAllMessage(db, groupID);
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

export async function superGroupSearchMessageByKeyword(
  contentTypeStr: string,
  keywordListStr: string,
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

    const execResult = databaseSuperGroupSearchMessageByKeyword(
      db,
      JSON.parse(contentTypeStr),
      JSON.parse(keywordListStr),
      keywordListMatchType,
      sourceID,
      startTime,
      endTime,
      sessionType,
      offset,
      count
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

export async function superGroupSearchMessageByContentType(
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

    const execResult = databaseSuperGroupSearchMessageByContentType(
      db,
      JSON.parse(contentTypeStr),
      sourceID,
      startTime,
      endTime,
      sessionType,
      offset,
      count
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

export async function superGroupSearchMessageByContentTypeAndKeyword(
  contentTypeStr: string,
  keywordListStr: string,
  keywordListMatchType: number,
  startTime: number,
  endTime: number,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupSearchMessageByContentTypeAndKeyword(
      db,
      JSON.parse(contentTypeStr),
      JSON.parse(keywordListStr),
      keywordListMatchType,
      startTime,
      endTime,
      groupID
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

export async function superGroupUpdateMessageStatusBySourceID(
  sourceID: string,
  status: string,
  sessionType: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupUpdateMessageStatusBySourceID(
      db,
      sourceID,
      status,
      sessionType
    );
    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'superGroupUpdateMessageStatusBySourceID no record updated';
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

export async function superGroupGetSendingMessageList(
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupGetSendingMessageList(db, groupID);

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

export async function superGroupUpdateGroupMessageHasRead(
  msgIDListStr: string,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupUpdateGroupMessageHasRead(
      db,
      JSON.parse(msgIDListStr),
      groupID
    );
    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'superGroupUpdateGroupMessageHasRead no record updated';
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

export async function superGroupGetMsgSeqByClientMsgID(
  clientMsgID: string,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupGetMsgSeqByClientMsgID(
      db,
      clientMsgID,
      groupID
    );

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

export async function superGroupUpdateMsgSenderFaceURLAndSenderNickname(
  sendID: string,
  faceURL: string,
  nickname: string,
  sessionType: number,
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult =
      databaseSuperGroupUpdateMsgSenderFaceURLAndSenderNickname(
        db,
        sendID,
        faceURL,
        nickname,
        sessionType,
        groupID
      );

    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'superGroupUpdateGroupMessageHasRead no record updated';
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

export async function superGroupSearchAllMessageByContentType(
  groupID: string,
  contentType: number
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupSearchAllMessageByContentType(
      db,
      groupID,
      contentType
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
