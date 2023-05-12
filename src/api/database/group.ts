import { DatabaseErrorCode } from '@/constant';
import {
  insertGroup as databaseInsertGroup,
  deleteGroup as databaseDeleteGroup,
  updateGroup as databaseUpdateGroup,
  getJoinedGroupList as databaseGetJoinedGroupList,
  getGroupInfoByGroupID as databaseGetGroupInfoByGroupID,
  getAllGroupInfoByGroupIDOrGroupName as databaseGetAllGroupInfoByGroupIDOrGroupName,
  subtractMemberCount as databaseSubtractMemberCount,
  addMemberCount as databaseAddMemberCount,
  getJoinedWorkingGroupIDList as databaseGetJoinedWorkingGroupIDList,
} from '@/sqls';
import { getInstance } from './instance';
import {
  convertSqlExecResult,
  formatResponse,
  jsonDecode,
  jsonEncode,
} from '@/utils';

export async function insertGroup(groupInfoStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseInsertGroup(db, jsonDecode(groupInfoStr, {}));

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function deleteGroup(groupId: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseDeleteGroup(db, groupId);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function updateGroup(
  groupId: string,
  groupInfoStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseUpdateGroup(
      db,
      groupId,
      jsonDecode(groupInfoStr, {})
    );

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function getJoinedGroupList(): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetJoinedGroupList(db);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function getGroupInfoByGroupID(groupId: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetGroupInfoByGroupID(db, groupId);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function getAllGroupInfoByGroupIDOrGroupName(
  keyword: string,
  isSearchGroupId: boolean,
  isSearchGroupName: boolean
): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetAllGroupInfoByGroupIDOrGroupName(
      db,
      keyword,
      isSearchGroupId,
      isSearchGroupName
    );

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function subtractMemberCount(groupId: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseSubtractMemberCount(db, groupId);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}
export async function addMemberCount(groupId: string): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseAddMemberCount(db, groupId);

    return formatResponse(convertSqlExecResult(execResult[0], 'CamelCase', []));
  } catch (error) {
    console.log(error);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorNoRecord,
      jsonEncode(error)
    );
  }
}

export async function getJoinedWorkingGroupIDList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetJoinedWorkingGroupIDList(db);

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
