import { DatabaseErrorCode } from '@/constant';
import {
  insertFriend as databaseInsertFriend,
  deleteFriend as databasedeleteFriend,
  updateFriend as databaseupdateFriend,
  getAllFriendList as databaseGetAllFriendList,
  searchFriendList as databasesearchFriendList,
  getFriendInfoByFriendUserID as databaseGetFriendInfoByFriendUserID,
  getFriendInfoList as databaseGetFriendInfoList,
  LocalFriend,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { getInstance } from './instance';

export async function insertFriend(localFriendStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const localFriend = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localFriendStr), {
        userID: 'friend_user_id',
        nickname: 'name',
      })
    ) as LocalFriend;

    databaseInsertFriend(db, localFriend);

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

    const execResult = databaseGetAllFriendList(db, loginUserID);

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        name: 'nickname',
        friend_user_id: 'userID',
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
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        name: 'nickname',
        friend_user_id: 'userID',
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

export async function getFriendInfoByFriendUserID(
  friendUserID: string,
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetFriendInfoByFriendUserID(
      db,
      friendUserID,
      loginUserID
    );

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        name: 'nickname',
        friend_user_id: 'userID',
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

export async function getFriendInfoList(
  friendUserIDListStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetFriendInfoList(
      db,
      JSON.parse(friendUserIDListStr)
    );

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        name: 'nickname',
        friend_user_id: 'userID',
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
