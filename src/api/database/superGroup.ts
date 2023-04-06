import { DatabaseErrorCode } from '@/constant';
import {
  getJoinedSuperGroupList as databaseGetJoinedSuperGroupList,
  insertSuperGroup as databaseInsertSuperGroup,
  updateSuperGroup as databaseUpdateSuperGroup,
  deleteSuperGroup as databaseDeleteSuperGroup,
  getSuperGroupInfoByGroupID as databaseGetSuperGroupInfoByGroupID,
  ClientGroup,
} from '@/sqls';
import {
  formatResponse,
  convertSqlExecResult,
  convertToSnakeCaseObject,
  convertObjectField,
} from '@/utils';
import { getInstance } from './instance';

export async function getJoinedSuperGroupList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetJoinedSuperGroupList(db);

    return formatResponse(convertSqlExecResult(execResult[0]));
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getJoinedSuperGroupIDList(): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetJoinedSuperGroupList(db);
    const records = convertSqlExecResult(execResult[0]);
    const groupIds = records.map(r => r.groupID);

    return formatResponse(groupIds);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getSuperGroupInfoByGroupID(
  groupID: string
): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseGetSuperGroupInfoByGroupID(db, groupID);

    if (execResult.length === 0) {
      return formatResponse(
        '',
        DatabaseErrorCode.ErrorNoRecord,
        `no super group with id ${groupID}`
      );
    }

    return formatResponse(convertSqlExecResult(execResult[0])[0]);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function deleteSuperGroup(groupID: string): Promise<string> {
  try {
    const db = await getInstance();

    const execResult = databaseDeleteSuperGroup(db, groupID);

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

export async function insertSuperGroup(groupStr: string): Promise<string> {
  try {
    const db = await getInstance();
    const group = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(groupStr), { groupName: 'name' })
    ) as ClientGroup;

    const execResult = databaseInsertSuperGroup(db, group);

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

export async function updateSuperGroup(
  groupID: string,
  groupStr: string
): Promise<string> {
  try {
    const db = await getInstance();
    const group = convertToSnakeCaseObject(
      convertObjectField(JSON.parse(groupStr), { groupName: 'name' })
    ) as ClientGroup;

    const execResult = databaseUpdateSuperGroup(db, groupID, group);
    const modifed = db.getRowsModified();
    if (modifed === 0) {
      throw 'updateSuperGroup no record updated';
    }

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
