type DatabaseAPI =
  | 'initDB'
  // message
  | 'getMessage'
  | 'getMultipleMessage'
  | 'getSendingMessageList'
  | 'getNormalMsgSeq'
  | 'updateMessageTimeAndStatus'
  | 'updateMessage'
  | 'insertMessage'
  | 'batchInsertMessageList'
  | 'getMessageList'
  | 'getMessageListNoTime'
  // conversation
  | 'getConversation'
  | 'getAllConversationListDB'
  | 'getAllConversationListToSync'
  | 'getHiddenConversationList'
  | 'updateColumnsConversation'
  | 'updateConversationForSync'
  | 'updateConversation'
  | 'decrConversationUnreadCount'
  | 'batchInsertConversationList'
  | 'insertConversation'
  | 'getTotalUnreadMsgCount'
  // users
  | 'getLoginUser'
  | 'insertLoginUser'
  | 'updateLoginUserByMap'
  | 'getJoinedSuperGroupList'
  | 'getJoinedSuperGroupIDList'
  | 'getSuperGroupInfoByGroupID'
  | 'deleteSuperGroup'
  | 'insertSuperGroup'
  | 'updateSuperGroup'
  // unread messages
  | 'deleteConversationUnreadMessageList'
  | 'batchInsertConversationUnreadMessageList'
  // super group messages
  | 'superGroupGetMessage'
  | 'superGroupGetMultipleMessage'
  | 'getSuperGroupNormalMsgSeq'
  | 'superGroupGetNormalMinSeq'
  | 'superGroupUpdateMessageTimeAndStatus'
  | 'superGroupUpdateMessage'
  | 'superGroupInsertMessage'
  | 'superGroupBatchInsertMessageList'
  | 'superGroupGetMessageListNoTime'
  | 'superGroupGetMessageList';

declare global {
  interface Window {
    // registered by js to provide database api
    [functionName: DatabaseAPI]: (...args: any[]) => Promise<any>;
    [functionName: string]: (...args: any[]) => Promise<any>;

    // registered by go wasm
    initSDK: (operationID: string, config: string) => void;
    login: (operationID: string, userID: string, token: string) => Promise<any>;
    logout: (operationID: string) => Promise<any>;
    commonEventFunc: (listener: (event: string) => void) => void;
    createTextMessage: (operationID: string, text: string) => Promise<string[]>;
    getAllConversationList: (operationID: string) => Promise<string>;
    getOneConversation: (
      operationID: string,
      sessionType: number,
      sourceID: string
    ) => Promise<string>;
    getAdvancedHistoryMessageList: (
      operationID: string,
      params: string
    ) => Promise<string>;
    getHistoryMessageList: (
      operationID: string,
      params: string
    ) => Promise<string>;
    getGroupsInfo: (operationID: string, params: string) => Promise<string>;
    // debug
    exec: (sql: string) => Promise<any>;
  }
  class Go {
    importObject: WebAssembly.Imports;
    run: (instance: WebAssembly.Instance) => Promise<void>;
  }
}

type IMConfig = {
  platform: number;
  api_addr: string;
  ws_addr: string;
  log_level: number;
};

type LoginParam = {
  userID: string;
  token: string;
  platformID: number;
  apiAddress: string;
  wsAddress: string;
  logLevel?: number;
};

type GetOneCveParams = {
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

type WSEvent = {
  event: CbEvents;
  data: unknown;
  errCode: number;
  errMsg: string;
  operationID: string;
};

enum RequestFunc {
  INITSDK = 'InitSDK',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  GETLOGINSTATUS = 'GetLoginStatus',
  GETLOGINUSER = 'GetLoginUser',
  GETSELFUSERINFO = 'GetSelfUserInfo',
  CREATETEXTMESSAGE = 'CreateTextMessage',
  CREATETEXTATMESSAGE = 'CreateTextAtMessage',
  CREATEADVANCEDTEXTMESSAGE = 'CreateAdvancedTextMessage',
  CREATEADVANCEDQUOTEMESSAGE = 'CreateAdvancedQuoteMessage',
  CREATEIMAGEMESSAGEFROMBYURL = 'CreateImageMessageByURL',
  CREATESOUNDMESSAGEBYURL = 'CreateSoundMessageByURL',
  CREATEVIDEOMESSAGEBYURL = 'CreateVideoMessageByURL',
  CREATEFILEMESSAGEBYURL = 'CreateFileMessageByURL',
  CREATEIMAGEMESSAGEFROMFULLPATH = 'CreateImageMessageFromFullPath',
  CREATESOUNDMESSAGEFROMFULLPATH = 'CreateSoundMessageFromFullPath',
  CREATEVIDEOMESSAGEFROMFULLPATH = 'CreateVideoMessageFromFullPath',
  CREATEFILEMESSAGEFROMFULLPATH = 'CreateFileMessageFromFullPath',
  CREATELOCATIONMESSAGE = 'CreateLocationMessage',
  CREATECUSTOMMESSAGE = 'CreateCustomMessage',
  CREATEMERGERMESSAGE = 'CreateMergerMessage',
  CREATEFORWARDMESSAGE = 'CreateForwardMessage',
  CREATEQUOTEMESSAGE = 'CreateQuoteMessage',
  CREATECARDMESSAGE = 'CreateCardMessage',
  CREATEFACEMESSAGE = 'CreateFaceMessage',
  SENDMESSAGE = 'SendMessage',
  SENDMESSAGENOTOSS = 'SendMessageNotOss',
  GETHISTORYMESSAGELIST = 'GetHistoryMessageList',
  GETADVANCEDHISTORYMESSAGELIST = 'GetAdvancedHistoryMessageList',
  GETHISTORYMESSAGELISTREVERSE = 'GetHistoryMessageListReverse',
  REVOKEMESSAGE = 'RevokeMessage',
  SETONECONVERSATIONPRIVATECHAT = 'SetOneConversationPrivateChat',
  DELETEMESSAGEFROMLOCALSTORAGE = 'DeleteMessageFromLocalStorage',
  DELETEMESSAGEFROMLOCALANDSVR = 'DeleteMessageFromLocalAndSvr',
  DELETECONVERSATIONFROMLOCALANDSVR = 'DeleteConversationFromLocalAndSvr',
  DELETEALLCONVERSATIONFROMLOCAL = 'DeleteAllConversationFromLocal',
  DELETEALLMSGFROMLOCALANDSVR = 'DeleteAllMsgFromLocalAndSvr',
  DELETEALLMSGFROMLOCAL = 'DeleteAllMsgFromLocal',
  MARKSINGLEMESSAGEHASREAD = 'MarkSingleMessageHasRead',
  INSERTSINGLEMESSAGETOLOCALSTORAGE = 'InsertSingleMessageToLocalStorage',
  INSERTGROUPMESSAGETOLOCALSTORAGE = 'InsertGroupMessageToLocalStorage',
  TYPINGSTATUSUPDATE = 'TypingStatusUpdate',
  MARKC2CMESSAGEASREAD = 'MarkC2CMessageAsRead',
  MARKMESSAGEASREADBYCONID = 'MarkMessageAsReadByConID',
  CLEARC2CHISTORYMESSAGE = 'ClearC2CHistoryMessage',
  CLEARC2CHISTORYMESSAGEFROMLOCALANDSVR = 'ClearC2CHistoryMessageFromLocalAndSvr',
  CLEARGROUPHISTORYMESSAGE = 'ClearGroupHistoryMessage',
  CLEARGROUPHISTORYMESSAGEFROMLOCALANDSVR = 'ClearGroupHistoryMessageFromLocalAndSvr',
  ADDFRIEND = 'AddFriend',
  SEARCHFRIENDS = 'SearchFriends',
  GETDESIGNATEDFRIENDSINFO = 'GetDesignatedFriendsInfo',
  GETRECVFRIENDAPPLICATIONLIST = 'GetRecvFriendApplicationList',
  GETSENDFRIENDAPPLICATIONLIST = 'GetSendFriendApplicationList',
  GETFRIENDLIST = 'GetFriendList',
  SETFRIENDREMARK = 'SetFriendRemark',
  ADDBLACK = 'AddBlack',
  GETBLACKLIST = 'GetBlackList',
  REMOVEBLACK = 'RemoveBlack',
  CHECKFRIEND = 'CheckFriend',
  ACCEPTFRIENDAPPLICATION = 'AcceptFriendApplication',
  REFUSEFRIENDAPPLICATION = 'RefuseFriendApplication',
  DELETEFRIEND = 'DeleteFriend',
  GETUSERSINFO = 'GetUsersInfo',
  SETSELFINFO = 'SetSelfInfo',
  GETALLCONVERSATIONLIST = 'GetAllConversationList',
  GETCONVERSATIONLISTSPLIT = 'GetConversationListSplit',
  GETONECONVERSATION = 'GetOneConversation',
  GETCONVERSATIONIDBYSESSIONTYPE = 'GetConversationIDBySessionType',
  GETMULTIPLECONVERSATION = 'GetMultipleConversation',
  DELETECONVERSATION = 'DeleteConversation',
  SETCONVERSATIONDRAFT = 'SetConversationDraft',
  PINCONVERSATION = 'PinConversation',
  GETTOTALUNREADMSGCOUNT = 'GetTotalUnreadMsgCount',
  GETCONVERSATIONRECVMESSAGEOPT = 'GetConversationRecvMessageOpt',
  SETCONVERSATIONRECVMESSAGEOPT = 'SetConversationRecvMessageOpt',
  SEARCHLOCALMESSAGES = 'SearchLocalMessages',
  MARKGROUPMESSAGEHASREAD = 'MarkGroupMessageHasRead',
  MARKGROUPMESSAGEASREAD = 'MarkGroupMessageAsRead',
  INVITEUSERTOGROUP = 'InviteUserToGroup',
  KICKGROUPMEMBER = 'KickGroupMember',
  GETGROUPMEMBERSINFO = 'GetGroupMembersInfo',
  GETGROUPMEMBERLIST = 'GetGroupMemberList',
  GETGROUPMEMBERLISTBYJOINTIME = 'GetGroupMemberListByJoinTime',
  GETJOINEDGROUPLIST = 'GetJoinedGroupList',
  CREATEGROUP = 'CreateGroup',
  SETGROUPINFO = 'SetGroupInfo',
  SETGROUPMEMBERNICKNAME = 'SetGroupMemberNickname',
  GETGROUPSINFO = 'GetGroupsInfo',
  JOINGROUP = 'JoinGroup',
  SEARCHGROUPS = 'SearchGroups',
  QUITGROUP = 'QuitGroup',
  DISMISSGROUP = 'DismissGroup',
  CHANGEGROUPMUTE = 'ChangeGroupMute',
  CHANGEGROUPMEMBERMUTE = 'ChangeGroupMemberMute',
  TRANSFERGROUPOWNER = 'TransferGroupOwner',
  GETSENDGROUPAPPLICATIONLIST = 'GetSendGroupApplicationList',
  GETRECVGROUPAPPLICATIONLIST = 'GetRecvGroupApplicationList',
  ACCEPTGROUPAPPLICATION = 'AcceptGroupApplication',
  REFUSEGROUPAPPLICATION = 'RefuseGroupApplication',
  SIGNAL_INGINVITE = 'SignalingInvite',
  SIGNALINGINVITEINGROUP = 'SignalingInviteInGroup',
  SIGNALINGACCEPT = 'SignalingAccept',
  SIGNALINGREJECT = 'SignalingReject',
  SIGNALINGCANCEL = 'SignalingCancel',
  SIGNALINGHUNGUP = 'SignalingHungUp',
  GETSUBDEPARTMENT = 'GetSubDepartment',
  GETDEPARTMENTMEMBER = 'GetDepartmentMember',
  GETUSERINDEPARTMENT = 'GetUserInDepartment',
  GETDEPARTMENTMEMBERANDSUBDEPARTMENT = 'GetDepartmentMemberAndSubDepartment',
  GETDEPARTMENTINFO = 'GetDepartmentInfo',
  SEARCHORGANIZATION = 'SearchOrganization',
  RESETCONVERSATIONGROUPATTYPE = 'ResetConversationGroupAtType',
  SETGROUPMEMBERROLELEVEL = 'SetGroupMemberRoleLevel',
  SETGROUPVERIFICATION = 'SetGroupVerification',
  SETGLOBALRECVMESSAGEOPT = 'SetGlobalRecvMessageOpt',
}

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

type OfflinePush = {
  title: string;
  desc: string;
  ex: string;
  iOSPushSound: string;
  iOSBadgeCount: boolean;
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

type PicBaseInfo = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
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

type MessageEntity = {
  type: string;
  offset: number;
  length: number;
  url?: string;
  info?: string;
};

type AdvancedMsgParams = {
  text: string;
  messageEntityList?: MessageEntity[];
};

type WsResponse = {
  event: RequestFunc;
  errCode: number;
  errMsg: string;
  data: any;
  operationID: string;
};

export enum CbEvents {
  LOGIN = 'Login',
  ONCONNECTFAILED = 'OnConnectFailed',
  ONCONNECTSUCCESS = 'OnConnectSuccess',
  ONCONNECTING = 'OnConnecting',
  ONKICKEDOFFLINE = 'OnKickedOffline',
  ONSELFINFOUPDATED = 'OnSelfInfoUpdated',
  ONUSERTOKENEXPIRED = 'OnUserTokenExpired',
  ONPROGRESS = 'OnProgress',
  ONRECVNEWMESSAGE = 'OnRecvNewMessage',
  ONRECVNEWMESSAGES = 'OnRecvNewMessages',
  ONRECVMESSAGEREVOKED = 'OnRecvMessageRevoked',
  ONRECVC2CREADRECEIPT = 'OnRecvC2CReadReceipt',
  ONRECVGROUPREADRECEIPT = 'OnRecvGroupReadReceipt',
  ONCONVERSATIONCHANGED = 'OnConversationChanged',
  ONNEWCONVERSATION = 'OnNewConversation',
  ONSYNCSERVERFAILED = 'OnSyncServerFailed',
  ONSYNCSERVERFINISH = 'OnSyncServerFinish',
  ONSYNCSERVERSTART = 'OnSyncServerStart',
  ONTOTALUNREADMESSAGECOUNTCHANGED = 'OnTotalUnreadMessageCountChanged',
  ONBLACKADDED = 'OnBlackAdded',
  ONBLACKDELETED = 'OnBlackDeleted',
  ONFRIENDAPPLICATIONACCEPTED = 'OnFriendApplicationAccepted',
  ONFRIENDAPPLICATIONADDED = 'OnFriendApplicationAdded',
  ONFRIENDAPPLICATIONDELETED = 'OnFriendApplicationDeleted',
  ONFRIENDAPPLICATIONREJECTED = 'OnFriendApplicationRejected',
  ONFRIENDINFOCHANGED = 'OnFriendInfoChanged',
  ONFRIENDADDED = 'OnFriendAdded',
  ONFRIENDDELETED = 'OnFriendDeleted',
  ONJOINEDGROUPADDED = 'OnJoinedGroupAdded',
  ONJOINEDGROUPDELETED = 'OnJoinedGroupDeleted',
  ONGROUPMEMBERADDED = 'OnGroupMemberAdded',
  ONGROUPMEMBERDELETED = 'OnGroupMemberDeleted',
  ONGROUPAPPLICATIONADDED = 'OnGroupApplicationAdded',
  ONGROUPAPPLICATIONDELETED = 'OnGroupApplicationDeleted',
  ONGROUPINFOCHANGED = 'OnGroupInfoChanged',
  ONGROUPMEMBERINFOCHANGED = 'OnGroupMemberInfoChanged',
  ONGROUPAPPLICATIONACCEPTED = 'OnGroupApplicationAccepted',
  ONGROUPAPPLICATIONREJECTED = 'OnGroupApplicationRejected',
  ONRECEIVENEWINVITATION = 'OnReceiveNewInvitation',
  ONINVITEEACCEPTED = 'OnInviteeAccepted',
  ONINVITEEREJECTED = 'OnInviteeRejected',
  ONINVITATIONCANCELLED = 'OnInvitationCancelled',
  ONHANGUP = 'OnHangUp',
  ONINVITATIONTIMEOUT = 'OnInvitationTimeout',
  ONINVITEEACCEPTEDBYOTHERDEVICE = 'OnInviteeAcceptedByOtherDevice',
  ONINVITEEREJECTEDBYOTHERDEVICE = 'OnInviteeRejectedByOtherDevice',
  ONORGANIZATIONUPDATED = 'OnOrganizationUpdated',
}
