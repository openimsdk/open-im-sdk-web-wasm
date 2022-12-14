import { DatabaseErrorCode } from '@/constant';
import {
  getMessageReactionExtension as databaseGetMessageReactionExtension,
  insertMessageReactionExtension as databaseInsertMessageReactionExtension,
  getAndUpdateMessageReactionExtension as databaseGetAndUpdateMessageReactionExtension,
  deleteAndUpdateMessageReactionExtension as databasDeleteAndUpdateMessageReactionExtension,
} from '@/sqls/localChatLogReactionExtensions';
import { converSqlExecResult, formatResponse, jsonDecode } from '@/utils';
import { getInstance } from './instance';

export async function getMessageReactionExtension(
  clientMsgID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetMessageReactionExtension(db, clientMsgID);

    if (execResult.length === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `GetMessageReactionExtension failed with msgId ${clientMsgID}`
      );
    }

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase')[0]);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function insertMessageReactionExtension(
  messageReactionExtensionStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    databaseInsertMessageReactionExtension(
      db,
      jsonDecode(messageReactionExtensionStr)
    );

    const modifiedCount = db.getRowsModified();

    if (modifiedCount === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `insertMessageReactionExtension failed with param ${messageReactionExtensionStr}`
      );
    }

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

export async function getAndUpdateMessageReactionExtension(
  clientMsgID: string,
  valueMapStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetAndUpdateMessageReactionExtension(
      db,
      clientMsgID,
      jsonDecode(valueMapStr)
    );

    return formatResponse(execResult);
  } catch (error) {
    console.error(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(error)
    );
  }
}

export async function deleteAndUpdateMessageReactionExtension(
  clientMsgID: string,
  valueMapStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasDeleteAndUpdateMessageReactionExtension(
      db,
      clientMsgID,
      jsonDecode(valueMapStr)
    );

    return formatResponse(execResult);
  } catch (error) {
    console.error(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(error)
    );
  }
}
