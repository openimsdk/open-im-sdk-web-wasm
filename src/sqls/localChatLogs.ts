import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientMessage = { [key: string]: any };

export function localChatLogs(db: Database): QueryExecResult[] {
  return db.exec(
    `
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
    `
  );
}

export function getMessage(db: Database, messageId: string): QueryExecResult[] {
  return db.exec(
    `
      select * from 'local_chat_logs' where client_msg_id='${messageId}'
    `
  );
}

export function getMultipleMessage(
  db: Database,
  msgIDList: string[]
): QueryExecResult[] {
  const values = msgIDList.map(v => `'${v}'`).join(',');

  return db.exec(
    `
      select * from local_sg_chat_logs where client_msg_id in (${values}) order by send_time desc;
    `
  );
}

export function getSendingMessageList(db: Database): QueryExecResult[] {
  return db.exec(
    `
      select * from local_chat_logs where status = 1;
    `
  );
}

export function getNormalMsgSeq(db: Database): QueryExecResult[] {
  return db.exec(
    `
      select ifnull(max(seq),0) from local_chat_logs;
    `
  );
}

export function updateMessageTimeAndStatus(
  db: Database,
  clientMsgID: string,
  serverMsgID: string,
  sendTime: number,
  status: number
): QueryExecResult[] {
  return db.exec(
    `
      update local_chat_logs set
        server_msg_id='${serverMsgID}',
        status=${status} ,
        send_time=${sendTime}
      where client_msg_id='${clientMsgID}' and seq=0;
    `
  );
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
  const isSelf = loginUserID === sourceID;
  return db.exec(
    `
        select * from local_chat_logs
        where
            recv_id = "${sourceID}"
            ${isSelf ? 'and' : 'or'}  send_id = "${sourceID}"
            and status <= 3
            and send_time ${isReverse ? '>' : '<'} ${startTime}
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `
  );
}

export function getMessageListNoTime(
  db: Database,
  sourceID: string,
  sessionType: number,
  count: number,
  isReverse: boolean,
  loginUserID: string
): QueryExecResult[] {
  const isSelf = loginUserID === sourceID;
  return db.exec(
    `
        select * from local_chat_logs
        where
            recv_id = "${sourceID}"
            ${isSelf ? 'and' : 'or'}  send_id = "${sourceID}"
            and status <= 3
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `
  );
}

export function messageIfExists(
  db: Database,
  clientMsgID: string
): QueryExecResult[] {
  return db.exec(
    `
        select count(*) from local_chat_logs
        where 
            client_msg_id = "${clientMsgID}";
    `
  );
}

export function isExistsInErrChatLogBySeq(
  db: Database,
  seq: number
): QueryExecResult[] {
  return db.exec(
    `
        select count(*) from local_err_chat_logs
        where 
            seq = ${seq};
    `
  );
}

export function messageIfExistsBySeq(
  db: Database,
  seq: number
): QueryExecResult[] {
  return db.exec(
    `
        select count(*) from local_chat_logs
        where 
            seq = ${seq};
    `
  );
}
// export function updateGroupMessageHasRead(
//   db: Database,
//   clientMsgID: string[],
//   sessionType: number
// ): QueryExecResult[] {
//   const values = clientMsgID.map(v => `'${v}'`).join(',');
//   return db.exec(
//     `  
//         update local_chat_logs
//         set is_read =1 
//         where session_type=${sessionType} 
//             and client_msg_id in (${values})    
        
//     `
//   );
// }


export function addMemberCount(
  db: Database,
  groupID : string,
): QueryExecResult[] {
  return db.exec(
    `  
    update local_groups set member_count = member_count+1 where group_id = '${groupID}'   
    `
  );
}
export function updateGroupMessageHasRead(
  db: Database,
  sessionType  : number,
  msgIDList : string[],
): QueryExecResult[] {
       const values = msgIDList.map(v => `'${v}'`).join(',');
  return db.exec(
    `  
    update local_chat_logs set is_read=1 where session_type='${sessionType}' and client_msg_id in (${values})   
    `
  );
}


export function subtractMemberCount(
  db: Database,
  groupID   : string
): QueryExecResult[] {

  return db.exec(
    `  
    update local_groups set member_count =member_count-1 where group_id = '${groupID}'
    `
  );
}

export function getJoinedWorkingGroupIDList(
  db: Database,
): QueryExecResult[] {

  return db.exec(
    `  
    select * from local_groups
    groupType = 2
    `
  );
}

export function getJoinedWorkingGroupList(
  db: Database,
): QueryExecResult[] {

  return db.exec(
    `  
    select * from local_groups
    groupType = 2
    `
  );
}
