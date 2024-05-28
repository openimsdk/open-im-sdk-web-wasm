import { CbEvents } from '..';
import {
  BlackUserItem,
  ConversationItem,
  FriendApplicationItem,
  FriendUserItem,
  GroupApplicationItem,
  GroupItem,
  GroupMemberItem,
  MessageItem,
  ReceiptInfo,
  RevokedInfo,
  SelfUserInfo,
  UserOnlineState,
} from './entity';

export type EventDataMap = {
  [CbEvents.OnProgress]: number;
  [CbEvents.OnBlackAdded]: BlackUserItem;
  [CbEvents.OnBlackDeleted]: BlackUserItem;
  [CbEvents.OnConversationChanged]: ConversationItem;
  [CbEvents.OnFriendAdded]: FriendUserItem;
  [CbEvents.OnFriendApplicationAdded]: FriendApplicationItem;
  [CbEvents.OnFriendApplicationDeleted]: FriendApplicationItem;
  [CbEvents.OnFriendApplicationRejected]: FriendApplicationItem;
  [CbEvents.OnFriendDeleted]: FriendUserItem;
  [CbEvents.OnFriendInfoChanged]: FriendUserItem;
  [CbEvents.OnGroupApplicationAdded]: GroupApplicationItem;
  [CbEvents.OnGroupApplicationDeleted]: GroupApplicationItem;
  [CbEvents.OnGroupApplicationRejected]: GroupApplicationItem;
  [CbEvents.OnGroupApplicationAccepted]: GroupApplicationItem;
  [CbEvents.OnGroupDismissed]: GroupItem;
  [CbEvents.OnGroupMemberDeleted]: GroupMemberItem;
  [CbEvents.OnGroupMemberInfoChanged]: GroupMemberItem;
  [CbEvents.OnJoinedGroupAdded]: GroupItem;
  [CbEvents.OnJoinedGroupDeleted]: GroupItem;
  [CbEvents.OnNewConversation]: ConversationItem[];
  [CbEvents.OnNewRecvMessageRevoked]: RevokedInfo;
  [CbEvents.OnRecvC2CReadReceipt]: ReceiptInfo[];
  [CbEvents.OnRecvGroupReadReceipt]: ReceiptInfo[];
  [CbEvents.OnRecvNewMessage]: MessageItem;
  [CbEvents.OnRecvNewMessages]: MessageItem[];
  [CbEvents.OnRecvOfflineNewMessage]: MessageItem;
  [CbEvents.OnRecvOfflineNewMessages]: MessageItem[];
  [CbEvents.OnSelfInfoUpdated]: SelfUserInfo;
  [CbEvents.OnSyncServerFailed]: void;
  [CbEvents.OnSyncServerStart]: void;
  [CbEvents.OnSyncServerFinish]: void;
  [CbEvents.OnTotalUnreadMessageCountChanged]: number;
  [CbEvents.OnUserStatusChanged]: UserOnlineState;
  [CbEvents.OnConnectFailed]: void;
  [CbEvents.OnConnectSuccess]: void;
  [CbEvents.OnConnecting]: void;
  [CbEvents.OnKickedOffline]: void;
  [CbEvents.OnUserTokenExpired]: void;
};

export type DataOfEvent<E extends CbEvents> = E extends keyof EventDataMap
  ? EventDataMap[E]
  : never;
