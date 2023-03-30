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

type SetConversationDraftParam = {
  conversationID: string;
  draftText: string;
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
  sessionType: number;
  clientMsgID: string;
  msgFirstModifyTime: number;
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
  sessionType: number;
  reactionExtensionList: Record<string, KeyValue>;
  isReact: boolean; //`json:"isReact,omitempty"`
  isExternalExtensions: boolean; //`json:"isExternalExtensions,omitempty"`
  msgFirstModifyTime: number; //`json:"msgFirstModifyTime,omitempty"`
};

type AddMessageReactionExtensionsParams = {
  messageStr: string;
  reactionExtensionListStr: string;
};

type AddMessageReactionExtensionsParam = Array<KeyValue>;

export {
  LoginParam,
  GetOneConversationParams,
  SetConversationDraftParam,
  GetAdvancedHistoryMsgParams,
  GetHistoryMsgParams,
  MarkC2CParams,
  MarkNotiParams,
  GetGroupMemberParams,
  SendMsgParams,
  ImageMsgParams,
  CustomMsgParams,
  QuoteMsgParams,
  AdvancedQuoteMsgParams,
  AdvancedMsgParams,
  MessageReaction,
  modifyGroupMessageReactionParams,
  SetMessageReactionExtensionsParams,
  DeleteMessageReactionExtensionsParams,
  GetMessageListReactionExtensionsParams,
  GetMessageListSomeReactionExtensionsParams,
  SetMessageReactionExtensionsCallback,
  SetMessageReactionExtensionsReq,
  DeleteMessageReactionExtensionsReq,
  GetMessageListReactionExtensionsReq,
  AddMessageReactionExtensionsReq,
  AddMessageReactionExtensionsParams,
  AddMessageReactionExtensionsParam,
};
