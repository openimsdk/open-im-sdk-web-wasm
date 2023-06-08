import { DatabaseErrorCode, MessageType } from '@/constant';
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
  superGroupSearchAllMessageByContentType as databaseSuperGroupSearchAllMessageByContentType,
  getSuperGroupAbnormalMsgSeq as databaseGetSuperGroupAbnormalMsgSeq,
  superGroupGetAlreadyExistSeqList as databaseSuperGroupGetAlreadyExistSeqList,
  superBatchInsertExceptionMsg as databaseSuperBatchInsertExceptionMsg,
} from '@/sqls';
import {
  convertSqlExecResult,
  convertToSnakeCaseObject,
  formatResponse,
  jsonDecode,
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
      convertSqlExecResult(execResult[0], 'CamelCase', [
        'isRead',
        'isReact',
        'isExternalExtensions',
      ])[0]
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
      messageIds,
      groupID
    );

    return formatResponse(
      convertSqlExecResult(execResult[0], 'CamelCase', [
        'isRead',
        'isReact',
        'isExternalExtensions',
      ])
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
      convertSqlExecResult(execResult[0], 'CamelCase', [
        'isRead',
        'isReact',
        'isExternalExtensions',
      ])
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
      convertSqlExecResult(execResult[0], 'CamelCase', [
        'isRead',
        'isReact',
        'isExternalExtensions',
      ])
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

    const modified = db.getRowsModified();
    if (modified === 0) {
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

export async function superGroupSearchAllMessageByContentType(
  groupID: string,
  contentType: MessageType
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseSuperGroupSearchAllMessageByContentType(
      db,
      groupID,
      contentType
    );

    return formatResponse(
      convertSqlExecResult(execResult[0], 'CamelCase', [
        'isRead',
        'isReact',
        'isExternalExtensions',
      ])
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

export async function superGroupGetAlreadyExistSeqList(
  groupID: string,
  lostSeqListStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const _lostSeqList = jsonDecode(lostSeqListStr, []);

    const execResult = databaseSuperGroupGetAlreadyExistSeqList(
      db,
      groupID,
      _lostSeqList
    );

    return formatResponse(execResult[0]?.values.flat() ?? []);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getSuperGroupAbnormalMsgSeq(
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetSuperGroupAbnormalMsgSeq(db, groupID);

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

export async function superBatchInsertExceptionMsg(
  errMsgListStr: string,
  groupID: string
): Promise<string> {
  try {
    const errMessageList = (
      JSON.parse(errMsgListStr) as ClientSuperGroupMessage[]
    ).map((v: Record<string, unknown>) => convertToSnakeCaseObject(v));

    const db = await getInstance();
    databaseSuperBatchInsertExceptionMsg(db, errMessageList, groupID);

    const modified = db.getRowsModified();
    if (modified === 0) {
      throw 'superBatchInsertExceptionMsg no record insert';
    }

    return formatResponse(0);
  } catch (e) {
    console.error(e);

    return formatResponse(
      'ErrorDBNoBatch',
      DatabaseErrorCode.ErrorDBNoBatch,
      JSON.stringify(e)
    );
  }
}
