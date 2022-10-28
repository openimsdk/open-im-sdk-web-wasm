import { DatabaseErrorCode } from '@/constant';
import {
  insertFriend as databaseinsertFriend,
  deleteFriend as databasedeleteFriend,
  updateFriend as databaseupdateFriend,
  getAllFriendList as databasegetAllFriendList,
  searchFriendList as databasesearchFriendList,
  getFriendInfoByFriendUserID as databasegetFriendInfoByFriendUserID,
  getFriendInfoList as databasegetFriendInfoList,
  LocalFriend,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { getInstance } from './instance';

export async function insertFriend(localFriendStr: string): Promise<string> {
  try {
    const db = await getInstance();

    const localFriend = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localFriendStr))
    ) as LocalFriend;

    databaseinsertFriend(db, localFriend);

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

export async function deleteFriend(
  friendUserID: string,
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    databasedeleteFriend(db, friendUserID, loginUserID);

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

export async function updateFriend(localFriendStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const localFriend = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localFriendStr))
    ) as LocalFriend;

    databaseupdateFriend(db, localFriend);

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

export async function getAllFriendList(loginUserID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetAllFriendList(db, loginUserID);

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

export async function searchFriendList(
  key: string,
  isSearchUserID: boolean,
  isSearchNickname: boolean,
  isSearchRemark: boolean
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasesearchFriendList(
      db,
      key,
      isSearchUserID,
      isSearchNickname,
      isSearchRemark
    );

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

export async function getFriendInfoByFriendUserID(
  friendUserID: string,
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetFriendInfoByFriendUserID(
      db,
      friendUserID,
      loginUserID
    );

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

export async function getFriendInfoList(
  friendUserIDList: string[]
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetFriendInfoList(db, friendUserIDList);

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
