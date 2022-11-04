import { DatabaseErrorCode } from '@/constant';
import {
  locaBlacks,
  localFriends,
  localGroups,
  localFriendRequests,
  localChatLogs,
  localErrChatLogs,
  localGroupRequests,
  localAdminGroupRequests,
  localConversations,
  localUsers,
  localSuperGroups,
  localConversationUnreadMessages,
  localGroupMembers,
  tempCacheLocalChatLogs,
} from '@/sqls';
import { formatResponse } from '@/utils';
import { QueryExecResult } from '@jlongster/sql.js';
import { getInstance, resetInstance } from './instance';

export async function init(userId: string, dir: string): Promise<string> {
  console.info(
    `=> (database api) invoke init with args ${JSON.stringify({
      userId,
      dir,
    })}`
  );

  try {
    console.time('SDK => (performance measure) init database used ');

    const db = await getInstance(`${dir}${userId}.sqlite`);
    const results: QueryExecResult[][] = [];
    const execResultLocalChatLogs = localChatLogs(db);
    const execResultLocalConversations = localConversations(db);
    const execResultLocalUsers = localUsers(db);
    const execResultLocalBlack = locaBlacks(db);
    const execResultLocalFriend = localFriends(db);
    const execResuLocalGroup = localGroups(db);
    const execResuLocalErrChatLos = localErrChatLogs(db);
    const execResuLocalGroupRequest = localGroupRequests(db);
    const execResuLocalGroupMembers = localGroupMembers(db);
    const execResuLocalAdminGroupRequest = localAdminGroupRequests(db);
    const execResultlocaFendRequest = localFriendRequests(db);
    const execResultLocalSuperGroups = localSuperGroups(db);
    const execResultTempCacheLocalChatLogs = tempCacheLocalChatLogs(db);
    const execResultLocalConversationUnreadMessages =
      localConversationUnreadMessages(db);

    results.push(
      ...[
        execResultLocalChatLogs,
        execResultLocalConversations,
        execResultLocalUsers,
        execResultLocalSuperGroups,
        execResultLocalConversationUnreadMessages,
        execResultLocalBlack,
        execResultLocalFriend,
        execResuLocalGroup,
        execResuLocalGroupMembers,
        execResultlocaFendRequest,
        execResuLocalErrChatLos,
        execResuLocalGroupRequest,
        execResuLocalAdminGroupRequest,
        execResultTempCacheLocalChatLogs,
      ]
    );

    return formatResponse(results);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  } finally {
    console.timeEnd('SDK => (performance measure) init database used ');
  }
}

export async function close() {
  console.info('=> (database api) invoke close');

  try {
    await resetInstance();

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
