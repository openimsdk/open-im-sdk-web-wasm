import { DatabaseErrorCode } from '@/constant';
import {
  localChatLogs,
  localConversations,
  localUsers,
  localSuperGroups,
  localConversationUnreadMessages,
} from '@/sqls';
import { formatResponse } from '@/utils';
import { QueryExecResult } from '@jlongster/sql.js';
import getInstance from './instance';

export async function init(userId: string, dir: string): Promise<string> {
  console.info(
    `=> (database api) invoke init with args ${JSON.stringify({
      userId,
      dir,
    })}`
  );

  try {
    const db = await getInstance(`${dir}${userId}.sqlite`);
    const results: QueryExecResult[][] = [];
    const execResultLocalChatLogs = localChatLogs(db);
    const execResultLocalConversations = localConversations(db);
    const execResultLocalUsers = localUsers(db);
    const execResultLocalSuperGroups = localSuperGroups(db);
    const execResultLocalConversationUnreadMessages =
      localConversationUnreadMessages(db);

    results.push(
      ...[
        execResultLocalChatLogs,
        execResultLocalConversations,
        execResultLocalUsers,
        execResultLocalSuperGroups,
        execResultLocalConversationUnreadMessages,
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
  }
}
