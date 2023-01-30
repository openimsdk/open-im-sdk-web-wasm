import { MessageEntity, OfflinePush, PicBaseInfo } from './entity';

type LoginParam = {
  userID: string;
  token: string;
  platformID: number;
  apiAddress: string;
  wsAddress: string;
  logLevel?: number;
  isCompression?: boolean;
  isExternalExtensions?: boolean;
};

type GetOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

type GetAdvancedHistoryMsgParams = {
  userID: string;
  lastMinSeq: number;
  groupID: string;
  conversationID?: string;
  startClientMsgID: string;
  count: number;
};

type GetHistoryMsgParams = {
  userID: string;
  groupID: string;
  count: number;
  startClientMsgID: string;
  conversationID?: string;
};

type MarkC2CParams = {
  userID: string;
  msgIDList: string[];
};

type MarkNotiParams = {
  conversationID: string;
  msgIDList: string[];
};

type GetGroupMemberParams = {
  groupID: string;
  filter: number;
  offset: number;
  count: number;
};

type SendMsgParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: string;
};

type ImageMsgParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
};

type CustomMsgParams = {
  data: string;
  extension: string;
  description: string;
};

type QuoteMsgParams = {
  text: string;
  message: string;
};

type AdvancedQuoteMsgParams = {
  text: string;
  message: string;
  messageEntityList?: MessageEntity[];
};

type AdvancedMsgParams = {
  text: string;
  messageEntityList?: MessageEntity[];
};

type MessageRevoked = {
  revokerID: string;
  revokerRole: number;
  clientMsgID: string;
  revokerNickname: string;
  revokeTime: number;
  sourceMessageSendTime: number;
  sourceMessageSendID: string;
  sourceMessageSenderNickname: string;
  sessionType: number;
  seq: number;
};

type KeyValue = {
  typeKey: string;
  value: string;
  latestUpdateTime: number;
};

type MessageReaction = {
  clientMsgID: string;
  reactionType: number;
  counter: number;
  userID: string;
  groupID: string;
  sessionType: number;
  info: string;
};

type modifyGroupMessageReactionParams = {
  counter: number;
  reactionType: number;
  groupID: string;
  msgID: string;
};

type SetMessageReactionExtensionsParams = {
  messageStr: string;
  reactionExtensionListStr: string;
};

type SetMessageReactionExtensionsParam = Array<KeyValue>;

type DeleteMessageReactionExtensionsParams = {
  messageStr: string;
  reactionExtensionKeyListStr: string;
};

type GetMessageListReactionExtensionsParams = {
  messageListStr: string;
};

type GetMessageListSomeReactionExtensionsParams = {
  messageListStr: string;
  reactionExtensionKeyListStr: string;
};

type SetMessageReactionExtensionsCallback = {
  key: string;
  value: string;
  errCode?: number;
  errMsg?: string;
};

type DeleteMessageReactionExtensionsParams = Array<string>;

type SetMessageReactionExtensionsReq = {
  operationID: string;
  clientMsgID: string;
  sourceID: string;
  sessionType: number;
  reactionExtensionList: Record<string, KeyValue>;
  isReact: boolean;
  isExternalExtensions: boolean;
  msgFirstModifyTime: number;
};

type DeleteMessageReactionExtensionsReq = {
  operationID: string;
  sourceID: string;
  sessionType: numberstring;
  clientMsgID: string;
  msgFirstModifyTime: numberstring;
  reactionExtensionList: Array<KeyValue>;
};

type OperateMessageListReactionExtensionsReq = {
  clientMsgID: string;
  msgFirstModifyTime: number;
};

type GetMessageListReactionExtensionsReq = {
  operationID: string;
  sourceID: string;
  sessionType: number;
  isExternalExtensions: boolean;
  typeKeyList: Array<string>;
  messageReactionKeyList: Array<OperateMessageListReactionExtensionsReq>;
};

type AddMessageReactionExtensionsReq = {
  operationID: string;
  clientMsgID: string;
  sourceID: string;
  sessionType: int32;
  reactionExtensionList: Record<string, KeyValue>;
  isReact: bool; //`json:"isReact,omitempty"`
  isExternalExtensions: bool; //`json:"isExternalExtensions,omitempty"`
  msgFirstModifyTime: int64; //`json:"msgFirstModifyTime,omitempty"`
};

type AddMessageReactionExtensionsParams = {
  messageStr: string;
  reactionExtensionListStr: string;
};
AddMessageReactionExtensionsParam = Array<KeyValue>;
