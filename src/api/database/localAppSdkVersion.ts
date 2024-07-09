import { DatabaseErrorCode } from '@/constant';
import {
  LocalAppSDKVersion,
  getAppSDKVersion as databaseGetAppSDKVersion,
  insertAppSDKVersion as databaseInsertAppSDKVersion,
  updateAppSDKVersion as databaseUpdateAppSDKVersion,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { getInstance } from './instance';

export async function getAppSDKVersion(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetAppSDKVersion(db);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function setAppSDKVersion(
  appSdkVersionStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const localAppSDKVersion = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(appSdkVersionStr))
    ) as LocalAppSDKVersion;

    const execResult = databaseGetAppSDKVersion(db);
    const version = converSqlExecResult(execResult[0], 'CamelCase', []);
    if (version[0].version) {
      const execResult = databaseUpdateAppSDKVersion(
        db,
        version[0].version as string,
        localAppSDKVersion
      );
      return formatResponse(
        converSqlExecResult(execResult[0], 'CamelCase', [])
      );
    } else {
      const execResult = databaseInsertAppSDKVersion(db, localAppSDKVersion);
      return formatResponse(
        converSqlExecResult(execResult[0], 'CamelCase', [])
      );
    }
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
