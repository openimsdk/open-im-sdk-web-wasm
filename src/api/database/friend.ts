import { DatabaseErrorCode } from '@/constant';
import {
  insertFriend as databaseinsertFriend,
  deleteFriend as databasedeleteFriend,
  updateFriend as databaseupdateFriend,
  getAllFriendList as databasegetAllFriendList,
  searchFriendList as databasesearchFriendList,
  getFriendInfoByFriendUserID as databasegetFriendInfoByFriendUserID,
  getFriendInfoList as databasegetFriendInfoList,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { getInstance } from './instance';



export async function insertFriend(LocalFriend: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseinsertFriend(db, LocalFriend);

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

export async function deleteFriend(friendUserID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasedeleteFriend(db, friendUserID);

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

export async function updateFriend(LocalFriend: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseupdateFriend(db, LocalFriend);

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

export async function getAllFriendList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetAllFriendList(db);

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
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

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
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

export async function getFriendInfoByFriendUserID(
  friendUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetFriendInfoByFriendUserID(db, friendUserID);

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
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

export async function getFriendInfoList(
    friendUserIDList    : string[]
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetFriendInfoList(db,friendUserIDList);

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', ['isRead'])
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
