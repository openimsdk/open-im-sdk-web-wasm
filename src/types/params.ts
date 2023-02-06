import { MessageEntity, OfflinePush, PicBaseInfo } from './entity';

type LoginParam = {
  userID: string;
  token: string;
  platformID: number;
  apiAddress: string;
  wsAddress: string;
  logLevel?: number;
  isCompression?: boolean;
};

type GetOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

type GetAdvancedHistoryMsgParams = {
  userID: string;
  groupID: string;
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID?: string;
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

export {
  LoginParam,
  GetOneConversationParams,
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
};
