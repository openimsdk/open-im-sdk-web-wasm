import { DatabaseErrorCode } from '@/constant';
import { getAllFriendList as databaseGetAllFriendList } from '@/sqls';
import { getInstance } from './instance';
import { convertSqlExecResult, formatResponse, jsonEncode } from '@/utils';

export async function getAllFriendList(ownerUserID: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetAllFriendList(db, ownerUserID);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
