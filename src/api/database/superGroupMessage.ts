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

    return formatResponse(converSqlExecResult(execResult[0]));
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

    if (execResult.length === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `super group update message failed groupID:${groupID}, clientMsgID:${clientMsgID}`
      );
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
