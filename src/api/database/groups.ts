import { DatabaseErrorCode } from '@/constant';
import {
  insertGroup as databaseinsertGroup,
  deleteGroup as databasedeleteGroup,
  updateGroup as databaseupdateGroup,
  getJoinedGroupList as databasegetJoinedGroupList,
  getAllGroupInfoByGroupIDOrGroupName as databasegetAllGroupInfoByGroupIDOrGroupName,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { getInstance } from './instance';



export async function insertGroup(LocalGroup: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseinsertGroup(db, LocalGroup);

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

export async function deleteGroup(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasedeleteGroup(db, groupID);

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

export async function updateGroup(LocalGroup: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseupdateGroup(db, LocalGroup);

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

export async function getJoinedGroupList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetJoinedGroupList(db);

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
export async function getAllGroupInfoByGroupIDOrGroupName(
  keyword: string,
  isSearchGroupID: boolean,
  isSearchGroupName: boolean
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databasegetAllGroupInfoByGroupIDOrGroupName(
      db,
      keyword,
      isSearchGroupID,
      isSearchGroupName
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
