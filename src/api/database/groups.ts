import { DatabaseErrorCode } from '@/constant';
import {
  insertGroup as databaseInsertGroup,
  deleteGroup as databasedeleteGroup,
  updateGroup as databaseupdateGroup,
  getJoinedGroupList as databaseGetJoinedGroupList,
  getGroupInfoByGroupID as databaseGetGroupInfoByGroupID,
  getAllGroupInfoByGroupIDOrGroupName as databaseGetAllGroupInfoByGroupIDOrGroupName,
  subtractMemberCount as databasesubtractMemberCount,
  addMemberCount as databaseaddMemberCount,
  LocalGroup,
} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { getInstance } from './instance';

export async function insertGroup(localGroupStr: string): Promise<string> {
  try {
    const db = await getInstance();

    const localGroup = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localGroupStr))
    ) as LocalGroup;

    databaseInsertGroup(db, localGroup);

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

    databasedeleteGroup(db, groupID);

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

export async function updateGroup(localGroupStr: string): Promise<string> {
  try {
    const db = await getInstance();

    const localGroup = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localGroupStr))
    ) as LocalGroup;

    databaseupdateGroup(db, localGroup);

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

    const execResult = databaseGetJoinedGroupList(db);

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

export async function getGroupInfoByGroupID(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetGroupInfoByGroupID(db, groupID);

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

    const execResult = databaseGetAllGroupInfoByGroupIDOrGroupName(
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

export async function subtractMemberCount(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    databasesubtractMemberCount(db, groupID);

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

export async function addMemberCount(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseaddMemberCount(db, groupID);

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

export async function getJoinedWorkingGroupIDList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetJoinedGroupList(db);
    const allJoinedGroupList = converSqlExecResult(execResult[0], 'CamelCase');
    const filterIDList = [] as string[];
    allJoinedGroupList.forEach(group => {
      if (group.groupType === 2) {
        filterIDList.push(group.group_id as string);
      }
    });
    return formatResponse(filterIDList);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getJoinedWorkingGroupList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetJoinedGroupList(db);
    const allJoinedGroupList = converSqlExecResult(execResult[0], 'CamelCase');

    return formatResponse(
      allJoinedGroupList.filter(group => group.group_type === 2)
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
