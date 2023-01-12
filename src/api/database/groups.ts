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
      convertObjectField(JSON.parse(localGroupStr), { groupName: 'name' })
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

export async function updateGroup(
  groupID: string,
  localGroupStr: string
): Promise<string> {
  try {
    const db = await getInstance();

    const localGroup = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(localGroupStr), { groupName: 'name' })
    ) as LocalGroup;

    databaseupdateGroup(db, groupID, localGroup);

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

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], { name: 'groupName' })
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

export async function getGroupInfoByGroupID(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetGroupInfoByGroupID(db, groupID);

    if (execResult.length === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `no group with id ${groupID}`
      );
    }

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], {
        name: 'groupName',
      })[0]
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

    return formatResponse(
      converSqlExecResult(execResult[0], 'CamelCase', [], { name: 'groupName' })
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

    databaseaddMemberCount(db, groupID);

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
        filterIDList.push(group.groupID as string);
      }
    });
    return formatResponse(JSON.stringify(filterIDList));
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
    const allJoinedGroupList = converSqlExecResult(
      execResult[0],
      'CamelCase',
      [],
      { name: 'groupName' }
    );
    const filterList = allJoinedGroupList.filter(
      group => group.group_type === 2
    );

    return formatResponse(JSON.stringify(filterList));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
