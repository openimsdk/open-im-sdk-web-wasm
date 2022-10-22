export type KeyType = 'CamelCase' | 'SnakeCase';

const InternalConstraint = [
  ['user_id', 'userID'],
  ['group_id', 'groupID'],
  ['client_msg_id', 'clientMsgID'],
  ['server_msg_id', 'serverMsgID'],
  ['send_id', 'sendID'],
  ['recv_id', 'recvID'],
  ['sender_platform_id', 'senderPlatformID'],
  ['sender_nick_name', 'senderNickname'],
  ['sender_face_url', 'senderFaceURL'],
  ['session_type', 'sessionType'],
  ['msg_from', 'msgFrom'],
  ['content_type', 'contentType'],
  ['content', 'content'],
  ['is_read', 'isRead'],
  ['status', 'status'],
  ['seq', 'seq'],
  ['send_time', 'sendTime'],
  ['create_time', 'createTime'],
  ['attached_info', 'attachedInfo'],
  ['ex', 'ex'],
  ['face_url', 'faceURL'],
  ['creator_user_id', 'creatorUserID'],
  ['conversation_id', 'conversationID'],
  ['owner_user_id', 'ownerUserID'],
  ['notification_user_id', 'notificationUserID'],
];

function _getInternalCamelCaseBySnakeCase(key: string) {
  const pair = InternalConstraint.find(p => {
    return p[0] === key;
  });

  if (pair) {
    return pair[1];
  }
}

function _getInternalSnakeCaseByCamelCase(key: string) {
  const pair = InternalConstraint.find(p => {
    return p[1] === key;
  });

  if (pair) {
    return pair[0];
  }
}

export function convertSnakeCaseToCamelCase(key: string) {
  const internalKey = _getInternalCamelCaseBySnakeCase(key);
  if (internalKey) {
    return internalKey;
  }

  const cArr = [];
  let lastSign = -2;
  for (let i = 0; i < key.length; i++) {
    const c = key[i];

    if (c === '_' && i < key.length - 1) {
      lastSign = i;
      continue;
    }

    if (i - 1 === lastSign) {
      cArr.push(c.toUpperCase());
    } else {
      cArr.push(c);
    }
  }

  return cArr.join('');
}

export function convertCamelCaseToSnakeCase(key: string) {
  const internalKey = _getInternalSnakeCaseByCamelCase(key);
  if (internalKey) {
    return internalKey;
  }

  const cArr = [];
  for (let i = 0; i < key.length; i++) {
    const c = key[i];

    if (c.toLowerCase() !== c) {
      cArr.push('_');
    }

    cArr.push(c.toLowerCase());
  }

  return cArr.join('');
}
