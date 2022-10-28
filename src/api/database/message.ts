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
  updateGroupMessageHasRead as databaseUpdateGroupMessageHasRead,
  addMemberCount as databaseaddMemberCount,
  updateGroupMessageHasRead as databaseupdateGroupMessageHasRead,
  subtractMemberCount as databasesubtractMemberCount,
  getJoinedWorkingGroupIDList as databasegetJoinedWorkingGroupIDList,
  getJoinedWorkingGroupList as databasegetJoinedWorkingGroupList,
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


export async function addMemberCount(groupID : string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseaddMemberCount(db, groupID);

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
    sessionType  : number ,
    msgIDList  : string[] ,
    ): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseupdateGroupMessageHasRead(db,sessionType,msgIDList);

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

export async function subtractMemberCount(
    groupID   : string ,
    ): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasesubtractMemberCount(db,groupID);

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


export async function getJoinedWorkingGroupIDList(

    ): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetJoinedWorkingGroupIDList(db);

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


export async function getJoinedWorkingGroupList(

    ): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetJoinedWorkingGroupList(db);

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

