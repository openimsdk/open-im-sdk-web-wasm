import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

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

  return db.exec(
    `
        select ifnull(max(seq),0) from local_sg_chat_logs_${groupID} where seq >0;
    `
  );
}

export function superGroupGetNormalMinSeq(
  db: Database,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
        select ifnull(min(seq),0) from local_sg_chat_logs_${groupID} where seq >0;
    `
  );
}

export function superGroupGetMessage(
  db: Database,
  groupID: string,
  clientMsgID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
        select * from local_sg_chat_logs_${groupID} where client_msg_id = '${clientMsgID}' limit 1
    `
  );
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
  return db.exec(
    `
        select * from local_sg_chat_logs_${groupID} where client_msg_id in (${values}) order by send_time desc;
    `
  );
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

  return db.exec(
    `
        update 
            local_sg_chat_logs_${groupID}
        set
            'server_msg_id' = '${serverMsgID}',
            'status' = ${status},
            'send_time' = ${sendTime}
        where
            client_msg_id = '${clientMsgID}' and seq = 0;
    `
  );
}

export function superGroupGetMessageListNoTime(
  db: Database,
  groupID: string,
  sessionType: number,
  count: number,
  isReverse: boolean
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
        select * from local_sg_chat_logs_${groupID}
        where
            recv_id = "${groupID}"
            and status <= 3
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `
  );
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

  return db.exec(
    `
        select * from local_sg_chat_logs_${groupID}
        where
            recv_id = "${groupID}"
            and status <= 3
            and send_time <= ${startTime}
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `
  );
}
