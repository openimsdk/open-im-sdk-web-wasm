import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientConversation = { [key: string]: any };

export function localConversations(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_conversations' (
            'conversation_id' char(128),
            'conversation_type' integer,
            'user_id' char(64),
            'group_id' char(128),
            'show_name' varchar(255),
            'face_url' varchar(255),
            'recv_msg_opt' integer,
            'unread_count' integer,
            'group_at_type' integer,
            'latest_msg' varchar(1000),
            'latest_msg_send_time' integer,
            'draft_text' text,
            'draft_text_time' integer,
            'is_pinned' numeric,
            'is_private_chat' numeric,
            'is_not_in_group' numeric,
            'update_unread_count_time' integer,
            'attached_info' varchar(1024),
            'ex' varchar(1024),
            primary key ('conversation_id')
        )
    `
  );
}

export function getAllConversationList(db: Database): QueryExecResult[] {
  return db.exec(
    `
        select * from local_conversations where latest_msg_send_time > 0 order by case when is_pinned=1 then 0 else 1 end,max(latest_msg_send_time,draft_text_time) desc;
    `
  );
}

export function getAllConversationListToSync(db: Database): QueryExecResult[] {
  return db.exec(
    `
        select * from local_conversations;
    `
  );
}

export function getHiddenConversationList(db: Database): QueryExecResult[] {
  return db.exec(
    `
        select * from local_conversations where latest_msg_send_time = 0;
    `
  );
}

export function getConversation(
  db: Database,
  conversationID: string
): QueryExecResult[] {
  return db.exec(
    `
        select * from local_conversations where conversation_id = '${conversationID}' limit 1;
    `
  );
}

export function getMultipleConversation(
  db: Database,
  conversationIDList: string[]
): QueryExecResult[] {
  const ids = conversationIDList.map(v => `'${v}'`);

  return db.exec(
    `
        select * from local_conversations where conversation_id in (${ids.join(
          ','
        )});
    `
  );
}

export function updateColumnsConversation(
  db: Database,
  conversationID: string,
  conversation: ClientConversation
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_conversations')
    .setFields(conversation)
    .where(`conversation_id = '${conversationID}'`)
    .toString();

  return db.exec(sql);
}

export function decrConversationUnreadCount(
  db: Database,
  conversationID: string,
  count: number
): QueryExecResult[] {
  return db.exec(
    `
        update local_conversations set 
            unread_count=unread_count-${count} 
        where conversation_id = '${conversationID}';
    `
  );
}

export function batchInsertConversationList(
  db: Database,
  conversationList: ClientConversation[]
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_conversations')
    .setFieldsRows(conversationList)
    .toString();

  return db.exec(sql);
}

export function getTotalUnreadMsgCount(db: Database): QueryExecResult[] {
  return db.exec(
    `
        select sum(unread_count) from local_conversations;
    `
  );
}
