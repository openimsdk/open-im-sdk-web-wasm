import { DatabaseErrorCode } from '@/constant';
import {
  getSendGroupApplication as databaseGetSendGroupApplication,
  getAdminGroupApplication as databaseGetAdminGroupApplication,
} from '@/sqls';
import { getInstance } from './instance';
import { convertSqlExecResult, formatResponse } from '@/utils';

export async function getSendGroupApplication(): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetSendGroupApplication(db);

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

export async function getAdminGroupApplication(): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetAdminGroupApplication(db);

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
