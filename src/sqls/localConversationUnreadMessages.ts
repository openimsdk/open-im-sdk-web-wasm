import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientLocalConversationUnreadMessage = { [key: string]: any };

export function localConversationUnreadMessages(
  db: Database
): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_conversation_unread_messages' (
            'conversation_id' char(128),
            'client_msg_id' char(64),
            'send_time' integer,
            'ex' varchar(1024),
            primary key (
                'conversation_id',
                'client_msg_id'
            )
        );
    `
  );
}

export function deleteConversationUnreadMessageList(
  db: Database,
  conversationID: string,
  sendTime: number
): QueryExecResult[] {
  const sql = squel
    .delete()
    .from('local_conversation_unread_messages')
    .where(`conversation_id='${conversationID}'`)
    .where(`send_time <= ${sendTime}`)
    .toString();

  return db.exec(sql);
}

export function batchInsertConversationUnreadMessageList(
  db: Database,
  messageList: ClientLocalConversationUnreadMessage[]
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_conversation_unread_messages')
    .setFieldsRows(messageList)
    .toString();

  return db.exec(sql);
}
