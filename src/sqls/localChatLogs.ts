import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { MessageStatus, MessageType } from '@/constant';

export type ClientMessage = { [key: string]: any };

export function localChatLogs(db: Database): QueryExecResult[] {
  return db.exec(`
      create table if not exists 'local_chat_logs' (
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
        primary key ('client_msg_id'))
    `);
}

export function getMessage(db: Database, messageId: string): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_chat_logs')
    .where(`client_msg_id='${messageId}'`)
    .toString();

  return db.exec(sql);
}

export function getMultipleMessage(
  db: Database,
  msgIDList: string[]
): QueryExecResult[] {
  // SELECT * FROM local_sg_chat_logs WHERE (client_msg_id in ('msg-id-1','msg-id-2')) ORDER BY send_time DESC
  const values = msgIDList.map(v => `'${v}'`).join(',');
  const sql = squel
    .select()
    .from('local_sg_chat_logs')
    .where(`client_msg_id in (${values})`)
    .order('send_time', false)
    .toString();

  return db.exec(sql);
}

export function getSendingMessageList(db: Database): QueryExecResult[] {
  // SELECT * FROM local_chat_logs WHERE (status = 1)
  const sql = squel
    .select()
    .from('local_chat_logs')
    .where('status = 1')
    .toString();

  return db.exec(sql);
}

export function getNormalMsgSeq(db: Database): QueryExecResult[] {
  // SELECT ifnull(max(seq),0) FROM local_chat_logs
  const sql = squel
    .select()
    .field('ifnull(max(seq),0)')
    .from('local_chat_logs')
    .toString();

  return db.exec(sql);
}

export function updateMessageTimeAndStatus(
  db: Database,
  clientMsgID: string,
  serverMsgID: string,
  sendTime: number,
  status: number
): QueryExecResult[] {
  // UPDATE local_chat_logs SET server_msg_id = '{{serverMsgID}}', status = {{1}}, send_time = {{167312312}} WHERE (client_msg_id='{{clientMsgID}}' and seq=0)
  const sql = squel
    .update()
    .table('local_chat_logs')
    .set('server_msg_id', `${serverMsgID}`)
    .set('status', status)
    .set('send_time', sendTime)
    .where(`client_msg_id='${clientMsgID}' and seq=0`)
    .toString();

  return db.exec(sql);
}

export function updateMessage(
  db: Database,
  clientMsgId: string,
  message: ClientMessage
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_chat_logs')
    .setFields(message)
    .where(`client_msg_id = '${clientMsgId}'`)
    .toString();

  return db.exec(sql);
}

export function insertMessage(
  db: Database,
  message: ClientMessage
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_chat_logs')
    .setFields(message)
    .toString();
  return db.exec(sql);
}

export function batchInsertMessageList(
  db: Database,
  messageList: ClientMessage[]
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_chat_logs')
    .setFieldsRows(messageList)
    .toString();

  return db.exec(sql);
}

export function getMessageList(
  db: Database,
  sourceID: string,
  sessionType: number,
  count: number,
  startTime: number,
  isReverse: boolean,
  loginUserID: string
): QueryExecResult[] {
  // SELECT * FROM local_chat_logs WHERE (recv_id = '{{sourceID}}' OR send_id = '{{sourceID}}') AND (status <= 3) AND (send_time < 167312312) AND (session_type = 102) ORDER BY send_time DESC LIMIT 40
  const sql = squel
    .select()
    .from('local_chat_logs')
    .where(
      loginUserID === sourceID
        ? squel
            .expr()
            .and(`recv_id = '${sourceID}'`)
            .and(`send_id = '${sourceID}'`)
            .toString()
        : squel
            .expr()
            .and(`recv_id = '${sourceID}'`)
            .or(`send_id = '${sourceID}'`)
            .toString()
    )
    .where(`status <= ${MessageStatus.Failed}`)
    .where(`send_time ${isReverse ? '>' : '<'} ${startTime}`)
    .where(`session_type = ${sessionType}`)
    .order('send_time', isReverse)
    .limit(count)
    .toString();

  return db.exec(sql);
}

export function getMessageListNoTime(
  db: Database,
  sourceID: string,
  sessionType: number,
  count: number,
  isReverse: boolean,
  loginUserID: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_chat_logs')
    .where(
      loginUserID === sourceID
        ? squel
            .expr()
            .and(`recv_id = '${sourceID}'`)
            .and(`send_id = '${sourceID}'`)
            .toString()
        : squel
            .expr()
            .and(`recv_id = '${sourceID}'`)
            .or(`send_id = '${sourceID}'`)
            .toString()
    )
    .where(`status <= ${MessageStatus.Failed}`)
    .where(`session_type = ${sessionType}`)
    .order('send_time', isReverse)
    .limit(count)
    .toString();

  return db.exec(sql);
}

export function searchAllMessageByContentType(
  db: Database,
  contentType: MessageType
) {
  const sql = squel
    .select()
    .from('local_chat_logs')
    .where(`content_type = ${contentType}`)
    .toString();

  return db.exec(sql);
}

export function getMsgSeqListByPeerUserID(
  db: Database,
  userID: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_chat_logs')
    .where(squel.expr().and(`recv_id='${userID}'`).or(`send_id='${userID}'`))
    .toString();

  return db.exec(sql);
}

export function getMsgSeqListBySelfUserID(
  db: Database,
  userID: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_chat_logs')
    .field('seq')
    .where(`recv_id='${userID}'`)
    .where(`send_id='${userID}'`)
    .toString();

  return db.exec(sql);
}

export function getMsgSeqListByGroupID(
  db: Database,
  groupID: string
): QueryExecResult[] {
  const sql = squel
    .select()
    .from('local_chat_logs')
    .field('seq')
    .where(`recv_id='${groupID}'`)
    .toString();
  return db.exec(sql);
}

export function updateMessageStatusBySourceID(
  db: Database,
  sourceID: string,
  status: number,
  sessionType: number,
  loginUserID: string
): QueryExecResult[] {
  // UPDATE local_chat_logs SET status = 1 WHERE (session_type={{102}}) AND (send_id= '{{sourceID}}' OR recv_id="{{sourceID}}")
  const sql = squel
    .update()
    .table('local_chat_logs')
    .set('status', status)
    .where(`session_type=${sessionType}`)
    .where(
      sessionType === 1 && sourceID === loginUserID
        ? squel.expr().and(`send_id='${sourceID}'`).and(`recv_id='${sourceID}'`)
        : squel.expr().and(`send_id= '${sourceID}'`).or(`recv_id="${sourceID}"`)
    )
    .toString();

  return db.exec(sql);
}
