import { DatabaseErrorCode } from '@/constant';
import {
    insertFriendRequest as databaseinsertFriendRequest,
    deleteFriendRequestBothUserID as databasedeleteFriendRequestBothUserID,
    updateFriendRequest as databaseupdateFriendRequest,
    getRecvFriendApplication as databasegetRecvFriendApplication,
    getSendFriendApplication as databasegetSendFriendApplication,
    getFriendApplicationByBothID as databasegetFriendApplicationByBothID,


} from '@/sqls';
import {
  converSqlExecResult,
  convertObjectField,
  convertToSnakeCaseObject,
  formatResponse,
} from '@/utils';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { getInstance } from './instance';






export async function insertFriendRequest(LocalFriendRequest: string): Promise<string> {
    try {
      const db = await getInstance();
  
      const execResult = databaseinsertFriendRequest(db, LocalFriendRequest);
  
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
    fromUserID: string ,
    toUserID : string,
    ): Promise<string> {
    try {
      const db = await getInstance();
  
      const execResult = databasedeleteFriendRequestBothUserID(db, fromUserID,toUserID);
  
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
    LocalFriendRequest: string ,
    ): Promise<string> {
    try {
      const db = await getInstance();
  
      const execResult = databaseupdateFriendRequest(db,LocalFriendRequest);
  
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

    ): Promise<string> {
    try {
      const db = await getInstance();
  
      const execResult = databasegetRecvFriendApplication(db,);
  
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
    groupID : string,
    ): Promise<string> {
    try {
      const db = await getInstance();
  
      const execResult = databasegetSendFriendApplication(db,groupID);
  
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
    fromUserID : string,
    toUserID : boolean,
    ): Promise<string> {
    try {
      const db = await getInstance();
  
      const execResult = databasegetFriendApplicationByBothID(db,fromUserID,toUserID);
  
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