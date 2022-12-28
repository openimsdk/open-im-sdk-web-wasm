import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';
import { MessageStatus, MessageType } from '@/constant';
import { localChatLogsModel } from '@/constant/db-model';

export type ClientSuperGroupMessage = { [key: string]: any };

const GroupTableMap: Record<string, boolean> = {};

function _initAndCheckSuperGroupTable(
  db: Database,
  groupID: string,
  colums?: Array<string>
) {
  if (GroupTableMap[groupID]) {
    if (colums) {
      try {
        const sql = `select * from local_sg_chat_logs_${groupID} limit 1`;

        const stmt = db.prepare(sql);

        stmt.step();

        const dbCurrentClms = stmt.getColumnNames();

        const missingClms: Array<string> = [];

        colums.forEach(value => {
          if (dbCurrentClms.indexOf(value) === -1) {
            missingClms.push(value);
          }
        });

        if (missingClms.length > 0) {
          const addClms = missingClms.filter(val => {
            return Object.keys(localChatLogsModel).includes(val);
          });

          addClms.forEach(val => {
            const sql = `ALTER TABLE local_sg_chat_logs_${groupID} ADD ${val} ${localChatLogsModel[val]}`;
            db.exec(sql);
          });
        }
      } catch (error) {
        console.error(error, `local_sg_chat_logs_${groupID}`);
      }
    } else {
      return;
    }
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
        'is_react' numeric,
        'is_external_extensions' numeric,
        'msg_first_modify_time' integer,
        primary key ('client_msg_id')
    );
    `
  );
}

export function getSuperGroupNormalMsgSeq(
  db: Database,
  groupID: string
): QueryExecResult[] {
  _initAndCheckSuperGroupTable(db, groupID);

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
  _initAndCheckSuperGroupTable(db, groupID);

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
  _initAndCheckSuperGroupTable(db, groupID);

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
  _initAndCheckSuperGroupTable(db, groupID, Object.keys(message));

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
  _initAndCheckSuperGroupTable(db, groupID, Object.keys(messageList[0]));

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
  _initAndCheckSuperGroupTable(db, groupID, Object.keys(message));

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
  _initAndCheckSuperGroupTable(db, groupID);

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
  _initAndCheckSuperGroupTable(db, groupID);

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
  _initAndCheckSuperGroupTable(db, groupID);

  return db.exec(
    `
        select * from local_sg_chat_logs_${groupID}
        where
            recv_id = "${groupID}"
            and status <= ${MessageStatus.Failed}
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
  _initAndCheckSuperGroupTable(db, groupID);

  return db.exec(
    `
        select * from local_sg_chat_logs_${groupID}
        where
            recv_id = "${groupID}"
            and status <= ${MessageStatus.Failed}
            and send_time <= ${startTime}
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `
  );
}

export function superGroupSearchAllMessageByContentType(
  db: Database,
  groupID: string,
  contentType: MessageType
) {
  _initAndCheckSuperGroupTable(db, groupID);

  return db.exec(
    `
        SELECT * FROM local_sg_chat_logs_${groupID}
        WHERE
            content_type = ${contentType};
    `
  );
}
