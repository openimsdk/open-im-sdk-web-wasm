import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { MessageStatus, MessageType } from '@/constant';

export type ClientSuperGroupMessage = { [key: string]: any };

const GroupTableMap: Record<string, boolean> = {};
const GroupErrChatLogsMap: Record<string, boolean> = {};

function _initSuperGroupTable(db: Database, groupID: string) {
  if (GroupTableMap[groupID]) {
    return;
  }

  localSgChatLogs(db, groupID);
  GroupTableMap[groupID] = true;
}

function _initSuperGroupErrLogsTable(db: Database, groupID: string) {
  if (GroupErrChatLogsMap[groupID]) {
    return;
  }

  localSgErrChatLogs(db, groupID);
  GroupErrChatLogsMap[groupID] = true;
}

export function localSgChatLogs(
  db: Database,
  groupID: string
): QueryExecResult[] {
  db.exec(
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

        'is_react' numeric,
        'is_external_extensions' numeric,
        'msg_first_modify_time' integer,

        primary key ('client_msg_id')
    );
    `
  );

  const tableInfo = db.exec(`PRAGMA table_info(local_sg_chat_logs_${groupID})`);
  if (tableInfo.length <= 0) {
    return tableInfo;
  }

  // check column for old version
  const hasColumnIsReact = tableInfo[0].values.find(v => v[1] === 'is_react');
  const hasColumnIsExternalExtensions = tableInfo[0].values.find(
    v => v[1] === 'is_external_extensions'
  );
  const hasColumnMsgFirstModifyTime = tableInfo[0].values.find(
    v => v[1] === 'msg_first_modify_time'
  );

  const result: QueryExecResult[] = [];
  if (!hasColumnIsReact) {
    result.push(
      ...db.exec(`
        alter table local_sg_chat_logs_${groupID} add is_react numeric
    `)
    );
  }

  if (!hasColumnIsExternalExtensions) {
    result.push(
      ...db.exec(`
        alter table local_sg_chat_logs_${groupID} add is_external_extensions numeric
    `)
    );
  }

  if (!hasColumnMsgFirstModifyTime) {
    result.push(
      ...db.exec(`
        alter table local_sg_chat_logs_${groupID} add msg_first_modify_time integer
    `)
    );
  }

  return result;
}

export function localSgErrChatLogs(db: Database, groupID: string) {
  return db.exec(
    `
      create table if not exists local_sg_err_chat_logs_${groupID} (
        "seq" integer,
        "client_msg_id" char(64),
        "server_msg_id" char(64),
        "send_id" char(64),
        "recv_id" char(64),
        "sender_platform_id" integer,
        "sender_nick_name" varchar(255),
        "sender_face_url" varchar(255),
        "session_type" integer,
        "msg_from" integer,
        "content_type" integer,
        "content" varchar(1000),
        "is_read" numeric,
        "status" integer,
        "send_time" integer,
        "create_time" integer,
        "attached_info" varchar(1024),
        "ex" varchar(1024),

        primary key ('seq'))
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
  msgIDList: string[],
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const values = msgIDList.map(v => `'${v}'`).join(',');

  const sql = `select * from local_sg_chat_logs_${groupID} where client_msg_id in (${values}) order by send_time desc;`;

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
        .and(`send_time ${isReverse ? '>' : '<'} ${startTime}`)
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

  return db.exec(
    `
        SELECT * FROM local_sg_chat_logs_${groupID}
        WHERE
            content_type = ${contentType};
    `
  );
}

export function superGroupGetAlreadyExistSeqList(
  db: Database,
  groupID: string,
  lostSeqList: string[]
) {
  _initSuperGroupTable(db, groupID);
  const values = lostSeqList.map(v => `'${v}'`).join(',');

  const sql = `select seq from local_sg_chat_logs_${groupID} where seq in (${values})`;

  return db.exec(sql);
}

export function getSuperGroupAbnormalMsgSeq(db: Database, groupID: string) {
  _initSuperGroupErrLogsTable(db, groupID);

  return db.exec(
    `SELECT IFNULL(max(seq), 0) FROM local_sg_err_chat_logs_${groupID}`
  );
}

export function superBatchInsertExceptionMsg(
  db: Database,
  errMessageList: ClientSuperGroupMessage[],
  groupID: string
) {
  _initSuperGroupErrLogsTable(db, groupID);

  const sql = squel
    .insert()
    .into(`local_sg_err_chat_logs_${groupID}`)
    .setFieldsRows(errMessageList)
    .toString();

  return db.exec(sql);
}
