/* eslint-disable @typescript-eslint/no-unsafe-call */
import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { jsonDecode, jsonEncode } from '@/utils';

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
  messageReactionExtension: ClientMessageReaction // client_msg_id , local_reaction_extensions
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_chat_log_reaction_extensions')
    .setFields(messageReactionExtension)
    .toString();

  return db.exec(sql);
}

type KeyValue = {
  typeKey: string;
  value: string;
  latestUpdateTime: number;
};

export function getAndUpdateMessageReactionExtension(
  db: Database,
  clientMsgID: string,
  valueMap: Record<string, KeyValue>
): QueryExecResult[] {
  db.exec('begin');

  const selectSql = squel
    .select()
    .field('local_reaction_extensions')
    .from('local_chat_log_reaction_extensions')
    .where(`client_msg_id = '${clientMsgID}'`)
    .toString();

  const selectResult = db.exec(selectSql);

  if (selectResult.length === 0) {
    const insertSql = squel
      .insert()
      .into('local_chat_log_reaction_extensions')
      .setFields({
        client_msg_id: clientMsgID,
        local_reaction_extensions: btoa(jsonEncode(valueMap)),
      })
      .toString();

    db.exec(insertSql);

    return db.exec('commit');
  } else {
    // update partial of local_reaction_extensions
    const oldValue =
      jsonDecode((selectResult[0].values[0][0] ?? '') as string) ?? {};
    for (const typeKey in valueMap) {
      oldValue[typeKey] = valueMap[typeKey];
    }
    const updateSql = squel
      .update()
      .table('local_chat_log_reaction_extensions')
      .set('local_reaction_extensions', btoa(jsonEncode(oldValue)))
      .where(`client_msg_id = '${clientMsgID}'`)
      .toString();

    db.exec(updateSql);

    const modifiedCount = db.getRowsModified();
    if (!(modifiedCount > 0)) {
      db.exec('rollback');
      throw 'getAndUpdateMessageReactionExtension rollback cause no updated after exec';
    } else {
      return db.exec('commit');
    }
  }
}

export function deleteAndUpdateMessageReactionExtension(
  db: Database,
  clientMsgID: string,
  valueMap: Record<string, KeyValue>
): QueryExecResult[] {
  db.exec('begin');

  const selectSql = squel
    .select()
    .field('local_reaction_extensions')
    .from('local_chat_log_reaction_extensions')
    .where(`client_msg_id = '${clientMsgID}'`)
    .toString();

  const selectResult = db.exec(selectSql);
  if (selectResult.length === 0) {
    return db.exec('commit');
  } else {
    // update partial of local_reaction_extensions
    const oldValue =
      jsonDecode((selectResult[0].values[0][0] ?? '') as string) ?? {};

    for (const clientMsgId in valueMap) {
      if (oldValue[clientMsgId]) {
        delete oldValue[clientMsgId];
      }
    }

    const updateSql = squel
      .update()
      .table('local_chat_log_reaction_extensions')
      .set('local_reaction_extensions', jsonEncode(oldValue))
      .where(`client_msg_id = ${clientMsgID}`)
      .toString();

    db.exec(updateSql);

    const modifiedCount = db.getRowsModified();
    if (!(modifiedCount > 0)) {
      db.exec('rollback');
      throw 'deleteAndUpdateMessageReactionExtension rollback cause no deleted after exec';
    } else {
      return db.exec('commit');
    }
  }
}

export function getMultipleMessageReactionExtension(
  db: Database,
  msgIDList: string[]
): QueryExecResult[] {
  // "SELECT * FROM local_chat_log_reaction_extensions WHERE (client_msg_id IN ('123', '321'))";
  if (!msgIDList) {
    return [];
  }
  const sql = squel
    .select()
    .from('local_chat_log_reaction_extensions')
    .where(`client_msg_id IN ("${msgIDList.join('","')}")`)
    .toString();

  return db.exec(sql);
}
