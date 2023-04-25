import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type ClientSuperGroupMessage = { [key: string]: any };

// const GroupTableMap: Record<string, boolean> = {};

function _initSuperGroupTable(db: Database, groupID: string) {
  // if (GroupTableMap[groupID]) {
  //   return;
  // }

  localSgChatLogs(db, groupID);
  // GroupTableMap[groupID] = true;
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
        'is_react' numeric,
        'is_external_extensions' numeric,
        'msg_first_modify_time' integer,
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
    .where(`client_msg_id = "${clientMsgID}"`)
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
            server_msg_id = "${serverMsgID}",
            status = ${status},
            send_time = ${sendTime}
        where
            client_msg_id = "${clientMsgID}" and seq = 0;
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
            and send_time < ${startTime}
            and session_type = ${sessionType}
        order by send_time ${isReverse ? 'asc' : 'desc'}
        limit ${count};    
    `
  );
}

export function superGroupDeleteAllMessage(
  db: Database,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
    DELETE
      FROM local_sg_chat_logs_${groupID}
    `
  );
}

export function superGroupSearchMessageByKeyword(
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
  _initSuperGroupTable(db, sourceID);

  const finalEndTime = endTime ? endTime : new Date().getTime();
  let subCondition = '';
  const values = contentType.map(v => `${v}`).join(',');
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
    SELECT * FROM local_sg_chat_logs_${sourceID} 
          WHERE session_type==${sessionType}
          And recv_id=="${sourceID}"
          And send_time  between ${startTime} and ${finalEndTime} 
          AND status <=3  
          And content_type IN (${values}) 
          ${subCondition}
    ORDER BY send_time DESC LIMIT ${count} OFFSET ${offset};
    `
  );
}

export function superGroupSearchMessageByContentType(
  db: Database,
  contentType: number[],
  sourceID: string,
  startTime: number,
  endTime: number,
  sessionType: number,
  offset: number,
  count: number
): QueryExecResult[] {
  _initSuperGroupTable(db, sourceID);

  const values = contentType.map(v => `${v}`).join(',');
  const finalEndTime = endTime ? endTime : new Date().getTime();
  return db.exec(
    `  
    SELECT * FROM local_sg_chat_logs_${sourceID} 
          WHERE session_type==${sessionType}
          And recv_id=="${sourceID}"
          And send_time between ${startTime} and ${finalEndTime} 
          AND status <=3 
          And content_type IN (${values}) 
    ORDER BY send_time DESC LIMIT ${count} OFFSET ${offset};
    `
  );
}

export function superGroupSearchMessageByContentTypeAndKeyword(
  db: Database,
  contentType: number[],
  keywordList: string[],
  keywordListMatchType: number,
  startTime: number,
  endTime: number,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

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
    SELECT * FROM local_sg_chat_logs_${groupID} 
          WHERE send_time between ${startTime} and ${finalEndTime}
          AND status <=3  
          And content_type IN (${values})
          ${subCondition}
    ORDER BY send_time DESC
    `
  );
}

export function superGroupUpdateMessageStatusBySourceID(
  db: Database,
  sourceID: string,
  status: string,
  sessionType: number
): QueryExecResult[] {
  _initSuperGroupTable(db, sourceID);

  return db.exec(
    `
    UPDATE local_sg_chat_logs_${sourceID}
      SET status=${status}
      WHERE (send_id = "${sourceID}" or recv_id = "${sourceID}")
        AND session_type = ${sessionType}
    `
  );
}

export function superGroupGetSendingMessageList(
  db: Database,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
    SELECT *
      FROM local_sg_chat_logs_${groupID}
      WHERE status = 1
    `
  );
}

export function superGroupUpdateGroupMessageHasRead(
  db: Database,
  msgIDList: string[],
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  const values = msgIDList.map(v => `'${v}'`).join(',');
  return db.exec(
    `
    UPDATE local_sg_chat_logs_${groupID}
    SET is_read=1
    WHERE client_msg_id in (${values})  
    `
  );
}

// export function superGroupGetNormalMsgSeq(
//   db: Database,
// ): QueryExecResult[] {

//   return db.exec(
//     `
//     SELECT IFNULL(max(seq), 0)
//       FROM local_chat_logs
//     `
//   );
// }

export function superGroupGetMsgSeqByClientMsgID(
  db: Database,
  clientMsgID: string,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
    SELECT seq
      FROM local_sg_chat_logs_${groupID}
      WHERE client_msg_id = "${clientMsgID}"
      LIMIT 1
    `
  );
}

export function superGroupUpdateMsgSenderFaceURLAndSenderNickname(
  db: Database,
  sendID: string,
  faceURL: string,
  nickname: string,
  sessionType: number,
  groupID: string
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
    UPDATE local_sg_chat_logs_${groupID}
      SET sender_face_url= "${faceURL}" , sender_nick_name = "${nickname}"
      WHERE send_id = "${sendID}"
      AND session_type = ${sessionType}
    `
  );
}

export function superGroupSearchAllMessageByContentType(
  db: Database,
  groupID: string,
  contentType: number
): QueryExecResult[] {
  _initSuperGroupTable(db, groupID);

  return db.exec(
    `
    SELECT * FROM local_sg_chat_logs_${groupID} WHERE content_type = ${contentType}
    `
  );
}
