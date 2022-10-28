import { DatabaseErrorCode } from '@/constant';
import {
  insertFriendRequest as databaseinsertFriendRequest,
  deleteFriendRequestBothUserID as databasedeleteFriendRequestBothUserID,
  updateFriendRequest as databaseupdateFriendRequest,
  getRecvFriendApplication as databasegetRecvFriendApplication,
  getSendFriendApplication as databasegetSendFriendApplication,
  getFriendApplicationByBothID as databasegetFriendApplicationByBothID,
  LocalFriendRequest,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { getInstance } from './instance';

export async function insertFriendRequest(
  localFriendRequestStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const localFriendRequest = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localFriendRequestStr))
    ) as LocalFriendRequest;

    databaseinsertFriendRequest(db, localFriendRequest);

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

export async function deleteFriendRequestBothUserID(
  fromUserID: string,
  toUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    databasedeleteFriendRequestBothUserID(db, fromUserID, toUserID);

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

export async function updateFriendRequest(
  localFriendRequestStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const localFriendRequest = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localFriendRequestStr))
    ) as LocalFriendRequest;
    databaseupdateFriendRequest(db, localFriendRequest);

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

export async function getRecvFriendApplication(
  loginUserID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetRecvFriendApplication(db, loginUserID);

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

export async function getSendFriendApplication(
  fromUserId: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetSendFriendApplication(db, fromUserId);

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

export async function getFriendApplicationByBothID(
  fromUserID: string,
  toUserID: boolean
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetFriendApplicationByBothID(
      db,
      fromUserID,
      toUserID
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
