import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientMessageReaction = { [key: string]: any };

export function localChatLogReactionExtensions(
  db: Database
): QueryExecResult[] {
  return db.exec(`
      create table if not exists 'local_chat_log_reaction_extensions' (
        'client_msg_id' char(64),
        'local_reaction_extensions' blob,
        primary key ('client_msg_id'))
    `);
}

export function getMessageReactionExtension(
  db: Database,
  clientMsgID: string
): QueryExecResult[] {
  return db.exec(`
  SELECT * FROM 'local_chat_log_reaction_extensions' WHERE client_msg_id="${clientMsgID}" LIMIT 1
    `);
}

export function insertMessageReactionExtension(
  db: Database,
  messageReactionExtension: ClientMessageReaction
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_chat_log_reaction_extensions')
    .setFields(messageReactionExtension)
    .toString();

  return db.exec(sql);
}
