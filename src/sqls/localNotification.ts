import { Database, QueryExecResult } from '@jlongster/sql.js';

export type LocalNotification = { [key: string]: any };

export function localNotification(db: Database): QueryExecResult[] {
  return db.exec(
    `
    create table if not exists 'local_notification_seqs'
        (
            'conversation_id' char(128),
            'seq'             integer,
            PRIMARY KEY ('conversation_id')
        )
      `
  );
}

export function setNotificationSeq(
  db: Database,
  conversationID: string,
  seq: number
): QueryExecResult[] {
  return db.exec(
    `UPDATE local_notification_seqs set seq = ${seq} where conversation_id = "${conversationID}"`
  );
}

export function getNotificationAllSeqs(db: Database): QueryExecResult[] {
  return db.exec('SELECT * from local_notification_seqs where 1 = 1;');
}
