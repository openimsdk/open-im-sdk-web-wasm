import { Database, QueryExecResult } from '@jlongster/sql.js';
import squel from 'squel';

export type LocalSendingMessage = { [key: string]: any };

export function localSendingMessages(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_sending_messages'
        (
            conversation_id varchar(128),
            client_msg_id   varchar(64),
            ex              varchar(1024),
            PRIMARY KEY ('conversation_id', 'client_msg_id')
        );
        `
  );
}

export function insertSendingMessage(
  db: Database,
  localSendingMessage: LocalSendingMessage
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_sending_messages')
    .setFields(localSendingMessage)
    .toString();

  return db.exec(sql);
}

export function deleteSendingMessage(
  db: Database,
  conversationID: string,
  clientMsgID: string
): QueryExecResult[] {
  const sql = squel
    .delete()
    .from('local_sending_messages')
    .where('conversation_id = ?', conversationID)
    .where('client_msg_id = ?', clientMsgID)
    .toString();

  return db.exec(sql);
}

export function getAllSendingMessages(db: Database): QueryExecResult[] {
  const sql = squel.select().from('local_sending_messages').toString();

  return db.exec(sql);
}
