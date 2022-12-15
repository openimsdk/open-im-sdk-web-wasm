import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { MessageStatus, MessageType } from '@/constant';

export type ClientSuperGroupMessage = { [key: string]: any };

const GroupTableMap: Record<string, boolean> = {};

function _initSuperGroupTable(db: Database, groupID: string) {
  if (GroupTableMap[groupID]) {
    return;
  }

  localSgChatLogs(db, groupID);
  GroupTableMap[groupID] = true;
}

export function localSgChatLogs(
  db: Database,
  groupID: string
): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists local_sg_chat_logs_${groupID} (
        'client_msg_id' char(64),
        'server_msg_id' char(64),
        'send_id' char(64),
        'recv_id' char(64),
        'sender_platform_id' integer,
        'sender_nick_name' varchar(255),
        'sender_face_url' varchar(255),
        'session_type' integer,
        'msg_from' integer,
        'content_type' integer,
        'content' varchar(1000),
        'is_read' numeric,
        'status' integer,
        'seq' integer default 0,
        'send_time' integer,
        'create_time' integer,
        'attached_info' varchar(1024),
        'ex' varchar(1024),
        primary key ('client_msg_id')
    );
    `
  );
}

export function getSuperGroupNormalMsgSeq(
  db: Database,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .field('ifnull(max(seq),0)')
    .where('seq > 0')
    .toString();

  return db.exec(sql);
}

export function superGroupGetNormalMinSeq(
  db: Database,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .field('ifnull(min(seq),0)')
    .where('seq > 0')
    .toString();

  return db.exec(sql);
}

export function superGroupGetMessage(
  db: Database,
  groupID: string,
  clientMsgID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .where(`client_msg_id = '${clientMsgID}'`)
    .limit(1)
    .toString();

  return db.exec(sql);
}

export function superGroupUpdateMessage(
  db: Database,
  groupID: string,
  clientMsgID: string,
  message: ClientSuperGroupMessage
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .update()
    .table(`local_sg_chat_logs_${groupID}`)
    .setFields(message)
    .where(`client_msg_id = '${clientMsgID}'`)
    .toString();

  return db.exec(sql);
}

export function superGroupBatchInsertMessageList(
  db: Database,
  groupID: string,
  messageList: ClientSuperGroupMessage[]
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .insert()
    .into(`local_sg_chat_logs_${groupID}`)
    .setFieldsRows(messageList)
    .toString();

  return db.exec(sql);
}

export function superGroupInsertMessage(
  db: Database,
  groupID: string,
  message: ClientSuperGroupMessage
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .insert()
    .into(`local_sg_chat_logs_${groupID}`)
    .setFields(message)
    .toString();

  return db.exec(sql);
}

export function superGroupGetMultipleMessage(
  db: Database,
  groupID: string,
  msgIDList: string[]
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const values = msgIDList.map(v => `'${v}'`).join(',');

  // SELECT * FROM local_sg_chat_logs_{{groupID}} WHERE (client_msg_id in (123,321)) ORDER BY send_time DESC
  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .where(`client_msg_id in (${values})`)
    .order('send_time', false)
    .toString();

  return db.exec(sql);
}

export function superGroupUpdateMessageTimeAndStatus(
  db: Database,
  groupID: string,
  clientMsgID: string,
  serverMsgID: string,
  sendTime: number,
  status: number
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .update()
    .table(`local_sg_chat_logs_${groupID}`)
    .set('server_msg_id', `${serverMsgID}`)
    .set('status', status)
    .set('send_time', sendTime)
    .where(squel.expr().and(`client_msg_id = '${clientMsgID}'`).and('seq = 0'))
    .toString();

  return db.exec(sql);
}

export function superGroupGetMessageListNoTime(
  db: Database,
  groupID: string,
  sessionType: number,
  count: number,
  isReverse: boolean
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .where(
      squel
        .expr()
        .and(`recv_id = '${groupID}'`)
        .and(`status <= ${MessageStatus.Failed}`)
        .and(`session_type = ${sessionType}`)
    )
    .order('send_time', isReverse)
    .limit(count)
    .toString();

  return db.exec(sql);
}

export function superGroupGetMessageList(
  db: Database,
  groupID: string,
  sessionType: number,
  count: number,
  startTime: number,
  isReverse: boolean
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);
  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .where(
      squel
        .expr()
        .and(`recv_id = '${groupID}'`)
        .and(`status <= ${MessageStatus.Failed}`)
        .and(`send_time <= ${startTime}`)
        .and(`session_type = ${sessionType}`)
    )
    .order('send_time', isReverse)
    .limit(count)
    .toString();

  return db.exec(sql);
}

export function superGroupSearchAllMessageByContentType(
  db: Database,
  groupID: string,
  contentType: MessageType
) {
  _initSuperGroupTable(db, groupID);

  const sql = squel
    .select()
    .from(`local_sg_chat_logs_${groupID}`)
    .where(`content_type = ${contentType}`)
    .toString();

  return db.exec(sql);
}
