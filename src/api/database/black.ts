import { DatabaseErrorCode } from '@/constant';
import {
  getBlackList as databasegetBlackList,
  getBlackListUserID as databasegetBlackListUserID,
  getFriendInfoByFriendUserID as databasegetFriendInfoByFriendUserID,
  getBlackInfoList as databasegetBlackInfoList,
  insertBlack as databaseinsertBlack,
  deleteBlack as databasedeleteBlack,
  updateBlack as databaseupdateBlack,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { getInstance } from './instance';



export async function getBlackList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetBlackList(db);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getBlackListUserID(blockUserID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetBlackListUserID(db, blockUserID);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

// export async function getFriendInfoByFriendUserID(
//   blockUserID: string
// ): Promise<string> {
//   try {
//     const db = await getInstance();

//     const execResult = databasegetFriendInfoByFriendUserID(db, blockUserID);

//     return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
//   } catch (e) {
//     console.error(e);

//     return formatResponse(
//       undefined,
//       DatabaseErrorCode.ErrorInit,
//       JSON.stringify(e)
//     );
//   }
// }

export async function getBlackInfoList(
  blockUserIDList: string[]
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetBlackInfoList(db, blockUserIDList);

    return formatResponse(converSqlExecResult(execResult[0], 'CamelCase'));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function insertBlack(LocalBlack: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseinsertBlack(db, LocalBlack);

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

export async function deleteBlack(blockUserID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasedeleteBlack(db, blockUserID);

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

export async function updateBlack(LocalBlack: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseupdateBlack(db, LocalBlack);

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
