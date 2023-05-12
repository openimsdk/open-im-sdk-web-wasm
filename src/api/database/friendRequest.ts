import { DatabaseErrorCode } from '@/constant';
import {
  getRecvFriendApplication as databaseGetRecvFriendApplication,
  getSendFriendApplication as databaseGetSendFriendApplication,
} from '@/sqls';
import { getInstance } from './instance';
import { convertSqlExecResult, formatResponse } from '@/utils';

export async function getRecvFriendApplication(
  toUserId: string
): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetRecvFriendApplication(db, toUserId);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
export async function getSendFriendApplication(
  toUserId: string
): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetSendFriendApplication(db, toUserId);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
