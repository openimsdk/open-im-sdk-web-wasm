import { DatabaseErrorCode } from '@/constant';
import {
  localChatLogs,
  localConversations,
  localUsers,
  localSuperGroups,
  localConversationUnreadMessages,
  localChatLogReactionExtensions,
  localGroupRequests,
  localAdminGroupRequests,
  localBlacks,
  localGroup,
  localFriendRequest,
  localErrChatLogs,
  localFriends,
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
    const execResultLocalSuperGroups = localSuperGroups(db);
    const execResultLocalConversationUnreadMessages =
      localConversationUnreadMessages(db);
    const execResultLocalChatLogReactionExtensions =
      localChatLogReactionExtensions(db);
    const execResultLocalGroupRequest = localGroupRequests(db);
    const execResultLocalAdminGroupRequest = localAdminGroupRequests(db);
    const execResultLocalBlacks = localBlacks(db);
    const execResultLocalGroup = localGroup(db);
    const execResultLocalFriendRequest = localFriendRequest(db);
    const execResultLocalErrChatLogs = localErrChatLogs(db);
    const execResultLocalFriends = localFriends(db);

    results.push(
      ...[
        execResultLocalChatLogs,
        execResultLocalConversations,
        execResultLocalUsers,
        execResultLocalSuperGroups,
        execResultLocalConversationUnreadMessages,
        execResultLocalChatLogReactionExtensions,
        execResultLocalGroupRequest,
        execResultLocalAdminGroupRequest,
        execResultLocalBlacks,
        execResultLocalGroup,
        execResultLocalFriendRequest,
        execResultLocalErrChatLogs,
        execResultLocalFriends,
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
