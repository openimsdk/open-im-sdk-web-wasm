import { converSqlExecResult, formatResponse } from '@/utils';
import { getExistedTables as databaseGetExistedTables } from '@/sqls';
import { DatabaseErrorCode } from '@/constant';
import { getInstance } from './instance';

export async function getExistedTables(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetExistedTables(db);

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        tbl_name: 'tblName',
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
