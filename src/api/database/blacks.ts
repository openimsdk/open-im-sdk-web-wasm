import { DatabaseErrorCode } from '@/constant';
import { getBlackList as databaseGetBlackList } from '@/sqls';
import { getInstance } from './instance';
import { convertSqlExecResult, formatResponse } from '@/utils';

export async function getBlackList(): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetBlackList(db);

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
