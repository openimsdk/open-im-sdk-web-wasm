import { DatabaseErrorCode } from '@/constant';
import {
  ClientUser,
  getLoginUser as databaseGetLoginUser,
  insertLoginUser as databaseInsertLoginUser,
  updateLoginUserByMap as databaseUpdateLoginUserByMap,
} from '@/sqls';
import {
  formatResponse,
  converSqlExecResult,
  convertToSnakeCaseObject,
  convertObjectField,
} from '@/utils';
import { getInstance } from './instance';

export async function getLoginUser(userID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetLoginUser(db, userID);

    if (execResult.length === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `no login user with id ${userID}`
      );
    }

    return formatResponse(converSqlExecResult(execResult[0])[0]);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function insertLoginUser(userStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const user = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(userStr), { nickname: 'name' })
    ) as ClientUser;

    const execResult = databaseInsertLoginUser(db, user);

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

export async function updateLoginUserByMap(
  userID: string,
  user: ClientUser
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseUpdateLoginUserByMap(db, userID, user);

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
