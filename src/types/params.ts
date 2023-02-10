import {
  MessageEntity,
  OfflinePush,
  PicBaseInfo,
  AtUsersInfoItem,
  GroupInitInfo,
  Member,
  RtcInvite,
  FullUserItem,
  MessageItem,
} from './entity';
import {
  OptType,
  AllowType,
  GroupJoinSource,
  GroupRole,
  GroupVerificationType,
  MessageType,
} from './enum';

export type LoginParam = {
  userID: string;
  token: string;
  platformID: number;
  apiAddress: string;
  wsAddress: string;
  logLevel?: number;
  isNeedEncryption?: boolean;
};

export type GetOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

export type GetAdvancedHistoryMsgParams = {
  userID: string;
  groupID: string;
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID?: string;
};

export type GetHistoryMsgParams = {
  userID: string;
  groupID: string;
  count: number;
  startClientMsgID: string;
  conversationID?: string;
};

export type MarkC2CParams = {
  userID: string;
  msgIDList: string[];
};

export type MarkNotiParams = {
  conversationID: string;
  msgIDList: string[];
};

export type GetGroupMemberParams = {
  groupID: string;
  filter: number;
  offset: number;
  count: number;
};

export type SendMsgParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: string;
  fileArrayBuffer?: ArrayBuffer;
  snpFileArrayBuffer?: ArrayBuffer;
};

export type ImageMsgParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
};

export type VideoMsgParams = {
  videoPath: string;
  duration: number;
  videoType: string;
  snapshotPath: string;
  videoUUID: string;
  videoUrl: string;
  videoSize: number;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
  snapShotType?: string;
};

export type VideoMsgFullParams = {
  videoFullPath: string;
  videoType: string;
  duration: number;
  snapshotFullPath: string;
};

export type CustomMsgParams = {
  data: string;
  extension: string;
  description: string;
};

export type QuoteMsgParams = {
  text: string;
  message: string;
};

export type AdvancedQuoteMsgParams = {
  text: string;
  message: string;
  messageEntityList?: MessageEntity[];
};

export type AdvancedMsgParams = {
  text: string;
  messageEntityList?: MessageEntity[];
};

export type SetPrvParams = {
  conversationID: string;
  isPrivate: boolean;
};

export type SplitConversationParams = {
  offset: number;
  count: number;
};

export type SetDraftParams = {
  conversationID: string;
  draftText: string;
};

export type PinCveParams = {
  conversationID: string;
  isPinned: boolean;
};

export type IsRecvParams = {
  conversationIDList: string[];
  opt: OptType;
};

export type UpdateMemberNameParams = {
  groupID: string;
  userID: string;
  GroupMemberNickname: string;
};

export type GroupBaseInfo = Partial<Omit<GroupInitInfo, 'groupType'>>;

export type JoinGroupParams = {
  groupID: string;
  reqMsg: string;
  joinSource: GroupJoinSource;
};

export type SearchGroupParams = {
  keywordList: string[];
  isSearchGroupID: boolean;
  isSearchGroupName: boolean;
};

export type ChangeGroupMuteParams = {
  groupID: string;
  isMute: boolean;
};

export type ChangeGroupMemberMuteParams = {
  groupID: string;
  userID: string;
  mutedSeconds: number;
};

export type TransferGroupParams = {
  groupID: string;
  newOwnerUserID: string;
};

export type AccessGroupParams = {
  groupID: string;
  fromUserID: string;
  handleMsg: string;
};

export type SetGroupRoleParams = {
  groupID: string;
  userID: string;
  roleLevel: GroupRole;
};

export type SetGroupVerificationParams = {
  verification: GroupVerificationType;
  groupID: string;
};

export type RtcActionParams = {
  opUserID: string;
  invitation: RtcInvite;
};

export type setPrvParams = {
  conversationID: string;
  isPrivate: boolean;
};

export type setBurnDurationParams = {
  conversationID: string;
  burnDuration: number;
};

export type LoginParams = {
  userID: string;
  token: string;
};
export type AtMsgParams = {
  text: string;
  atUserIDList: string[];
  atUsersInfo?: AtUsersInfoItem[];
  message?: string;
};

export type SoundMsgParams = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
  soundType?: string;
};

export type FileMsgParams = {
  filePath: string;
  fileName: string;
  uuid: string;
  sourceUrl: string;
  fileSize: number;
  fileType?: string;
};

export type FileMsgFullParams = {
  fileFullPath: string;
  fileName: string;
};

export type SouondMsgFullParams = {
  soundPath: string;
  duration: number;
};

export type MergerMsgParams = {
  messageList: MessageItem[];
  title: string;
  summaryList: string[];
};

export type FaceMessageParams = {
  index: number;
  data: string;
};

export type LocationMsgParams = {
  description: string;
  longitude: number;
  latitude: number;
};

export type GroupMsgReadParams = {
  groupID: string;
  msgIDList: string[];
};
export type InsertSingleMsgParams = {
  message: string;
  recvID: string;
  sendID: string;
};

export type InsertGroupMsgParams = {
  message: string;
  groupID: string;
  sendID: string;
};

export type TypingUpdateParams = {
  recvID: string;
  msgTip: string;
};

export type SplitParams = {
  offset: number;
  count: number;
};
export type GetOneCveParams = {
  sourceID: string;
  sessionType: number;
};
export type isRecvParams = {
  conversationIDList: string[];
  opt: OptType;
};
export type SearchLocalParams = {
  conversationID: string;
  keywordList: string[];
  keywordListMatchType?: number;
  senderUserIDList?: string[];
  messageTypeList?: MessageType[];
  searchTimePosition?: number;
  searchTimePeriod?: number;
  pageIndex?: number;
  count?: number;
};
export type AddFriendParams = {
  toUserID: string;
  reqMsg: string;
};
export type SearchFriendParams = {
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchNickname: boolean;
  isSearchRemark: boolean;
};
export type RemarkFriendParams = {
  toUserID: string;
  remark: string;
};
export type AccessFriendParams = {
  toUserID: string;
  handleMsg: string;
};
export type InviteGroupParams = {
  groupID: string;
  reason: string;
  userIDList: string[];
};
export type GetGroupMemberByTimeParams = {
  groupID: string;
  filterUserIDList: string[];
  offset: number;
  count: number;
  joinTimeBegin: number;
  joinTimeEnd: number;
};
export type SearchGroupMemberParams = {
  groupID: string;
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchMemberNickname: boolean;
  offset: number;
  count: number;
};
export type SetMemberAuthParams = {
  rule: AllowType;
  groupID: string;
};
export type CreateGroupParams = {
  groupBaseInfo: GroupInitInfo;
  memberList: Member[];
};
export type GroupInfoParams = {
  groupID: string;
  groupInfo: GroupBaseInfo;
};
export type MemberNameParams = {
  groupID: string;
  userID: string;
  GroupMemberNickname: string;
};

export type MemberExParams = {
  groupID: string;
  userID: string;
  ex: string;
};

export type GetSubDepParams = {
  departmentID: string;
  offset: number;
  count: number;
};

export type FindMessageParams = {
  conversationID: string;
  clientMsgIDList: string[];
};

export type PartialUserItem = Partial<Omit<FullUserItem, 'userID'>> & {
  userID: string;
};

export type CustomSignalParams = {
  roomID: string;
  customInfo: string;
};
