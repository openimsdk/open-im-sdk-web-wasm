import { CbEvents, RequestFunc } from '../constant';
import {
  GroupType,
  SessionType,
  MessageType,
  Platform,
  MessageStatus,
  GroupStatus,
  GroupVerificationType,
  AllowType,
  GroupJoinSource,
  GroupRole,
  OptType,
  GroupAtType,
} from './enum';

// api

export type WSEvent = {
  event: CbEvents;
  data: unknown;
  errCode: number;
  errMsg: string;
  operationID: string;
};

export type WsResponse = {
  event: RequestFunc;
  errCode: number;
  errMsg: string;
  data: any;
  operationID: string;
};

export type IMConfig = {
  platform: number;
  api_addr: string;
  ws_addr: string;
  log_level: number;
};

export type MessageEntity = {
  type: string;
  offset: number;
  length: number;
  url?: string;
  info?: string;
};

export type PicBaseInfo = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};

export type AtUsersInfoItem = {
  atUserID: string;
  groupNickname: string;
};

export type GroupInitInfo = {
  groupType: GroupType;
  groupName: string;
  introduction?: string;
  notification?: string;
  faceURL?: string;
  ex?: string;
};

export type Member = {
  userID: string;
  roleLevel: number;
};

export type RtcInvite = {
  inviterUserID: string;
  inviteeUserIDList: string[];
  groupID: string;
  roomID: string;
  timeout: number;
  mediaType: string;
  sessionType: number;
  platformID: number;
};

export type GroupApplicationItem = {
  createTime: number;
  creatorUserID: string;
  ex: string;
  gender: number;
  groupFaceURL: string;
  groupID: string;
  groupName: string;
  groupType: number;
  handleResult: number;
  handleUserID: string;
  handledMsg: string;
  handledTime: number;
  introduction: string;
  memberCount: number;
  nickname: string;
  notification: string;
  ownerUserID: string;
  reqMsg: string;
  reqTime: number;
  status: number;
  userFaceURL: string;
  userID: string;
};

export type FriendApplicationItem = {
  createTime: number;
  ex: string;
  fromFaceURL: string;
  fromGender: number;
  fromNickname: string;
  fromUserID: string;
  handleMsg: string;
  handleResult: number;
  handleTime: number;
  handlerUserID: string;
  reqMsg: string;
  toFaceURL: string;
  toGender: number;
  toNickname: string;
  toUserID: string;
};

export type TotalUserStruct = {
  blackInfo: BlackItem | null;
  friendInfo: FriendItem | null;
  publicInfo: PublicUserItem | null;
};

export type PublicUserItem = {
  gender: number;
  nickname: string;
  userID: string;
  faceURL: string;
  ex: string;
};

export type FullUserItem = {
  birth: number;
  birthTime: string;
  createTime: number;
  email: string;
  ex: string;
  faceURL: string;
  gender: number;
  nickname: string;
  phoneNumber: string;
  userID: string;
};

export type PartialUserItem = Partial<Omit<FullUserItem, 'userID'>> & {
  userID: string;
};

export type FriendItem = {
  addSource: number;
  birth: number;
  createTime: number;
  email: string;
  ex: string;
  faceURL: string;
  userID: string;
  gender: number;
  nickname: string;
  operatorUserID: string;
  ownerUserID: string;
  phoneNumber: string;
  remark: string;
};

export type FriendRelationItem = {
  result: number;
  userID: string;
};

export type BlackItem = {
  addSource: number;
  userID: string;
  createTime: number;
  ex: string;
  faceURL: string;
  gender: number;
  nickname: string;
  operatorUserID: string;
  ownerUserID: string;
};

export type GroupItem = {
  groupID: string;
  groupName: string;
  notification: string;
  notificationUserID: string;
  notificationUpdateTime: number;
  introduction: string;
  faceURL: string;
  ownerUserID: string;
  createTime: number;
  memberCount: number;
  status: GroupStatus;
  creatorUserID: string;
  groupType: number;
  needVerification: GroupVerificationType;
  ex: string;
  applyMemberFriend: AllowType;
  lookMemberInfo: AllowType;
};

export type GroupMemberItem = {
  groupID: string;
  userID: string;
  nickname: string;
  faceURL: string;
  roleLevel: GroupRole;
  muteEndTime: number;
  joinTime: number;
  joinSource: GroupJoinSource;
  inviterUserID: string;
  operatorUserID: string;
  ex: string;
};

export type ConversationItem = {
  conversationID: string;
  conversationType: SessionType;
  userID: string;
  groupID: string;
  showName: string;
  faceURL: string;
  recvMsgOpt: OptType;
  unreadCount: number;
  groupAtType: GroupAtType;
  latestMsg: string;
  latestMsgSendTime: number;
  draftText: string;
  draftTextTime: number;
  isPinned: boolean;
  isNotInGroup: boolean;
  isPrivateChat: boolean;
  attachedInfo: string;
  ex: string;
};

export type MessageItem = {
  clientMsgID: string;
  serverMsgID: string;
  createTime: number;
  sendTime: number;
  sessionType: SessionType;
  sendID: string;
  recvID: string;
  msgFrom: number;
  contentType: MessageType;
  platformID: Platform;
  senderNickname: string;
  senderFaceUrl: string;
  groupID: string;
  content: string;
  seq: number;
  isRead: boolean;
  status: MessageStatus;
  offlinePush: OfflinePush;
  attachedInfo: string;
  attachedInfoElem: AttachedInfoElem;
  ex: string;
  pictureElem: PictureElem;
  soundElem: SoundElem;
  videoElem: VideoElem;
  fileElem: FileElem;
  faceElem: FaceElem;
  mergeElem: MergeElem;
  atElem: AtElem;
  locationElem: LocationElem;
  customElem: CustomElem;
  quoteElem: QuoteElem;
  notificationElem: NotificationElem;
  progress?: number;
  downloadProgress?: number;
  downloaded?: boolean;
  errCode?: number;
};

export type NotificationElem = {
  detail: string;
  defaultTips: string;
};

export type AtElem = {
  text: string;
  atUserList: string[];
  atUsersInfo?: AtUsersInfoItem[];
  quoteMessage?: string;
  isAtSelf?: boolean;
};

export type CustomElem = {
  data: string;
  description: string;
  extension: string;
};

export type FileElem = {
  filePath: string;
  uuid: string;
  sourceUrl: string;
  fileName: string;
  fileSize: number;
};

export type FaceElem = {
  index: number;
  data: string;
};

export type LocationElem = {
  description: string;
  longitude: number;
  latitude: number;
};

export type MergeElem = {
  title: string;
  abstractList: string[];
  multiMessage: MessageItem[];
};

export type OfflinePush = {
  title: string;
  desc: string;
  ex: string;
  iOSPushSound: string;
  iOSBadgeCount: boolean;
};

export type PictureElem = {
  sourcePath: string;
  sourcePicture: Picture;
  bigPicture: Picture;
  snapshotPicture: Picture;
};

export type AttachedInfoElem = {
  groupHasReadInfo: GroupHasReadInfo;
  isPrivateChat: boolean;
  isEncryption: boolean;
  burnDuration: number;
  hasReadTime: number;
  notSenderNotificationPush: boolean;
  messageEntityList: MessageEntity[];
};

export type GroupHasReadInfo = {
  hasReadCount: number;
  hasReadUserIDList: string[];
  groupMemberCount: number;
};

export type Picture = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};

export type QuoteElem = {
  text: string;
  quoteMessage: MessageItem;
};

export type SoundElem = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
};

export type VideoElem = {
  videoPath: string;
  videoUUID: string;
  videoUrl: string;
  videoType: string;
  videoSize: number;
  duration: number;
  snapshotPath: string;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
};

export type AdvancedRevokeContent = {
  clientMsgID: string;
  revokeTime: number;
  revokerID: string;
  revokerNickname: string;
  revokerRole: number;
  seq: number;
  sessionType: SessionType;
  sourceMessageSendID: string;
  sourceMessageSendTime: number;
  sourceMessageSenderNickname: string;
};
