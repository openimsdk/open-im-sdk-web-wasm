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

export function searchMessageByKeyword(
  db: Database,
  contentType: number[],
  keywordList: string[],
  keywordListMatchType: number,
  sourceID: string,
  startTime: number,
  endTime: number,
  sessionType: number,
  offset: number,
  count: number
): QueryExecResult[] {
  // const values = msgIDList.map(v => `'${v}'`).join(',');
  const finalEndTime = endTime ? endTime : new Date().getTime();
  return db.exec(
    `  
    SELECT * FROM local_chat_logs 
          WHERE session_type==${sessionType}
          And (send_id=="${sourceID}" OR recv_id=="${sourceID}") 
          And send_time  between ${startTime} and ${finalEndTime} 
          AND status <=3  
          And content_type IN (101,106) 
          And (content like '%${keywordList[0]}%')  
    ORDER BY send_time DESC LIMIT ${count}
    `
  );
}

export function searchMessageByContentType(
  db: Database,
  contentType: number[],
  sourceID: string,
  startTime: number,
  endTime: number,
  sessionType: number,
  offset: number,
  count: number
): QueryExecResult[] {
  const values = contentType.map(v => `${v}`).join(',');
  const finalEndTime = endTime ? endTime : new Date().getTime();
  return db.exec(
    `  
    SELECT * FROM local_chat_logs 
          WHERE session_type==${sessionType}
          And (send_id=="${sourceID}" OR recv_id=="${sourceID}") 
          And send_time between ${startTime} and ${finalEndTime} 
          AND status <=3 
          And content_type IN (values) 
    ORDER BY send_time DESC LIMIT ${count}
    `
  );
}

export function searchMessageByContentTypeAndKeyword(
  db: Database,
  contentType: number[],
  keywordList: string[],
  keywordListMatchType: number,
  startTime: number,
  endTime: number
): QueryExecResult[] {
  const values = contentType.map(v => `${v}`).join(',');
  const finalEndTime = endTime ? endTime : new Date().getTime();
  let subCondition = '';
  const connectStr = keywordListMatchType === 0 ? 'or ' : 'and ';
  keywordList.forEach((keyword, index) => {
    if (index == 0) {
      subCondition += 'And (';
    }
    if (index + 1 >= keywordList.length) {
      subCondition += 'content like ' + "'%" + keywordList[index] + "%') ";
    } else {
      subCondition +=
        'content like ' + "'%" + keywordList[index] + "%' " + connectStr;
    }
  });

  return db.exec(
    `  
    SELECT * FROM local_chat_logs 
          WHERE send_time between ${startTime} and ${finalEndTime}
          AND status <=3  
          And content_type IN (${values})
          ${subCondition}
    ORDER BY send_time DESC
    `
  );
}

export function updateMsgSenderNickname(
  db: Database,
  sendID: string,
  nickname: string,
  sessionType: number
): QueryExecResult[] {
  return db.exec(
    `  
    UPDATE local_chat_logs 
          SET sender_nick_name="${nickname}" 
          WHERE send_id = "${sendID}" 
          and session_type = ${sessionType}
          and sender_nick_name != "${nickname}"
    `
  );
}

export function updateMsgSenderFaceURL(
  db: Database,
  sendID: string,
  faceURL: string,
  sessionType: number
): QueryExecResult[] {
  return db.exec(
    `  
    UPDATE local_chat_logs 
          SET sender_face_url="${faceURL}" 
          WHERE send_id = "${sendID}" 
          and session_type = ${sessionType}
          and sender_face_url != "${faceURL}"
    `
  );
}

export function updateMsgSenderFaceURLAndSenderNickname(
  db: Database,
  sendID: string,
  faceURL: string,
  nickname: string,
  sessionType: number
): QueryExecResult[] {
  return db.exec(
    `  
    UPDATE local_chat_logs 
          SET sender_face_url="${faceURL}",sender_nick_name="${nickname}" 
          WHERE send_id = "${sendID}" 
          and session_type = ${sessionType}
    `
  );
}

export function getMsgSeqByClientMsgID(
  db: Database,
  clientMsgID: string
): QueryExecResult[] {
  return db.exec(
    `  
    SELECT seq FROM local_chat_logs 
    WHERE client_msg_id="${clientMsgID}" 
    LIMIT 1
    `
  );
}

export function getMsgSeqListByGroupID(
  db: Database,
  groupID: string
): QueryExecResult[] {
  return db.exec(
    `  
    SELECT seq FROM local_chat_logs 
    WHERE recv_id="${groupID}"
    `
  );
}

export function getMsgSeqListByPeerUserID(
  db: Database,
  userID: string
): QueryExecResult[] {
  return db.exec(
    `  
    SELECT seq FROM local_chat_logs 
    WHERE recv_id="${userID}" 
    or send_id="${userID}"
    `
  );
}

export function getMsgSeqListBySelfUserID(
  db: Database,
  userID: string
): QueryExecResult[] {
  return db.exec(
    `  
    SELECT seq FROM local_chat_logs 
    WHERE recv_id="${userID}" 
    and send_id="${userID}"
    `
  );
}

export function deleteAllMessage(db: Database): QueryExecResult[] {
  return db.exec(
    `  
    UPDATE local_chat_logs SET content="",status=4
    `
  );
}

export function getAllUnDeleteMessageSeqList(db: Database): QueryExecResult[] {
  return db.exec(
    `  
    SELECT seq FROM local_chat_logs WHERE status != 4
    `
  );
}

export function updateSingleMessageHasRead(
  db: Database,
  sendID: string,
  clientMsgIDList: string[]
): QueryExecResult[] {
  const values = clientMsgIDList.map(v => `'${v}'`).join(',');
  return db.exec(
    `  
    UPDATE local_chat_logs SET is_read=1 
    WHERE send_id="${sendID}"  
    AND session_type=1 
    AND client_msg_id in ("${values}")
    `
  );
}

export function updateGroupMessageHasRead(
  db: Database,
  clientMsgIDList: string[],
  sessionType: number
): QueryExecResult[] {
  const values = clientMsgIDList.map(v => `'${v}'`).join(',');
  return db.exec(
    `
        update local_chat_logs
        set is_read =1
        where session_type=${sessionType}
            and client_msg_id in (${values})

    `
  );
}
