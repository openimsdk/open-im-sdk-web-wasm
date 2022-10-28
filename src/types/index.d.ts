import { CbEvents } from '../constant';

type DatabaseApi = (...args: any[]) => Promise<any>;

declare global {
  interface Window {
    // registered by js to provide database api
    [functionName: DatabaseAPI]: (...args: any[]) => Promise<any>;
    // [functionName: string]: (...args: any[]) => Promise<any>;

    initDB: DatabaseApi;
    // message
    getMessage: DatabaseApi;
    getMultipleMessage: DatabaseApi;
    getSendingMessageList: DatabaseApi;
    getNormalMsgSeq: DatabaseApi;
    updateMessageTimeAndStatus: DatabaseApi;
    updateMessage: DatabaseApi;
    insertMessage: DatabaseApi;
    batchInsertMessageList: DatabaseApi;
    getMessageList: DatabaseApi;
    getMessageListNoTime: DatabaseApi;
    messageIfExists: DatabaseApi;
    isExistsInErrChatLogBySeq: DatabaseApi;
    messageIfExistsBySeq: DatabaseApi;
    // conversation
    getAllConversationListDB: DatabaseApi;
    getAllConversationListToSync: DatabaseApi;
    getHiddenConversationList: DatabaseApi;
    getConversation: DatabaseApi;
    getMultipleConversation: DatabaseApi;
    updateColumnsConversation: DatabaseApi;
    updateConversation: DatabaseApi;
    updateConversationForSync: DatabaseApi;
    decrConversationUnreadCount: DatabaseApi;
    batchInsertConversationList: DatabaseApi;
    insertConversation: DatabaseApi;
    getTotalUnreadMsgCount: DatabaseApi;
    // users
    getLoginUser: DatabaseApi;
    insertLoginUser: DatabaseApi;
    updateLoginUserByMap: DatabaseApi;
    getJoinedSuperGroupList: DatabaseApi;
    getJoinedSuperGroupIDList: DatabaseApi;
    getSuperGroupInfoByGroupID: DatabaseApi;
    deleteSuperGroup: DatabaseApi;
    insertSuperGroup: DatabaseApi;
    updateSuperGroup: DatabaseApi;
    // unread messages
    deleteConversationUnreadMessageList: DatabaseApi;
    batchInsertConversationUnreadMessageList: DatabaseApi;
    // super group messages
    superGroupGetMessage: DatabaseApi;
    superGroupGetMultipleMessage: DatabaseApi;
    superGroupGetNormalMinSeq: DatabaseApi;
    getSuperGroupNormalMsgSeq: DatabaseApi;
    superGroupUpdateMessageTimeAndStatus: DatabaseApi;
    superGroupUpdateMessage: DatabaseApi;
    superGroupInsertMessage: DatabaseApi;
    superGroupBatchInsertMessageList: DatabaseApi;
    superGroupGetMessageListNoTime: DatabaseApi;
    superGroupGetMessageList: DatabaseApi;
    getRowsModified: DatabaseApi;



    // black
    getBlackList : DatabaseApi ;
    getBlackListUserID : DatabaseApi ;
    getBlackInfoList : DatabaseApi ;
    insertBlack : DatabaseApi ;
    deleteBlack : DatabaseApi ;
    updateBlack : DatabaseApi ;



    //friend_request
    insertFriendRequest  :  DatabaseApi ;
    deleteFriendRequestBothUserID :  DatabaseApi ;
    updateFriendRequest :  DatabaseApi ;
    getRecvFriendApplication :  DatabaseApi ;
    getSendFriendApplication :  DatabaseApi ;
    getFriendApplicationByBothID :  DatabaseApi ;


    //friend 
    insertFriend : DatabaseApi ;
    deleteFriend : DatabaseApi ;
    updateFriend : DatabaseApi ;
    getAllFriendList : DatabaseApi ;
    searchFriendList : DatabaseApi ;
    getFriendInfoByFriendUserID : DatabaseApi ;
    getFriendInfoList : DatabaseApi ;


    //groups
    insertGroup :DatabaseApi ;
    deleteGroup :DatabaseApi ;
    updateGroup :DatabaseApi ;
    getJoinedGroupList :DatabaseApi ;
    getAllGroupInfoByGroupIDOrGroupName :DatabaseApi ;


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
      getAdvancedHistoryMessageListParamsStr: string
    ) => Promise<string>;
    getHistoryMessageList: (
      operationID: string,
      getHistoryMsgParamsParamsStr: string
    ) => Promise<string>;
    getGroupsInfo: (operationID: string, params: string) => Promise<string>;
    deleteConversationFromLocalAndSvr: (
      operationID: string,
      conversationID: string
    ) => Promise<string>;
    markC2CMessageAsRead: (
      operationID: string,
      userID: string,
      msgIDListStr: string
    ) => Promise<string>;
    markMessageAsReadByConID: (
      operationID: string,
      conversationID: string,
      msgIDListStr: string
    ) => Promise<string>;
    getGroupMemberList: (
      operationID: string,
      groupID: string,
      filter: number,
      offset: number,
      count: number
    ) => Promise<string>;
    createImageMessageByURL: (
      operationID: string,
      sourcePictureStr: string,
      bigPictureStr: string,
      snapshotPictureStr: string
    ) => Promise<string>;
    createCustomMessage: (
      operationID: string,
      data: string,
      extension: string,
      description: string
    ) => Promise<string>;
    createQuoteMessage: (
      operationID: string,
      text: string,
      message: string
    ) => Promise<string>;
    createAdvancedQuoteMessage: (
      operationID: string,
      text: string,
      message: string,
      messageEntityListStr: string
    ) => Promise<string>;
    createAdvancedTextMessage: (
      operationID: string,
      text: string,
      messageEntityListStr: string
    ) => Promise<string>;
    sendMessage: (
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfoStr: string
    ) => Promise<string>;
    sendMessageNotOss: (
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfoStr: string
    ) => Promise<string>;
    getHistoryMessageListReverse: (
        operationID: string,
        getMessageOptions: string,
      ) => Promise<string>;
      revokeMessage: (
        operationID: string,
        params: string,
      ) => Promise<string>;
      setOneConversationPrivateChat: (
        operationID: string,
        conversationID : string,
        isPrivate: boolean ,
      ) => Promise<string>;
      getLoginStatus: (
        operationID: string,
      ) => Promise<string>;
      iLogin: (
        operationID: string,
        token : string,
        userID: string,
      ) => Promise<string>;
      getLoginUser: (
        operationID: string,
      ) => Promise<string>;
      getSelfUserInfo: (
        operationID: string,
      ) => Promise<string>;
      getUsersInfo: (
        operationID: string,
        userIDList: string[]
      ) => Promise<string>;
      setSelfInfo: (
        operationID: string,
        userInfo: string[]
      ) => Promise<string>;
      createTextAtMessage: (
        operationID: string,
        text: string,
        atUserIDList: string[],
        atUsersInfo?: AtUsersInfoItem[],
        message?: string,
      ) => Promise<string>;
      createSoundMessage: (
        operationID: string,
        uuid: string,
        soundPath: string,
        sourceUrl: string,
        dataSize: number,
        duration: number,
      ) => Promise<string>;
      createVideoMessage: (
        operationID: string,
        videoPath: string,
        duration: string,
        videoType: string,
        snapshotPath: number,
        videoUUID: number,
        videoUrl: string,
        videoSize: number,
        snapshotUUID: string,
        snapshotSize: number,
        snapshotUrl: string,
        snapshotWidth: number,
        snapshotHeight: number,
      ) => Promise<string>;
    // debug
    exec: (sql: string) => Promise<any>;
  }
  class Go {
    exited: boolean;
    importObject: WebAssembly.Imports;
    run: (instance: WebAssembly.Instance) => Promise<void>;
  }
}

export type WSEvent = {
  event: CbEvents;
  data: unknown;
  errCode: number;
  errMsg: string;
  operationID: string;
};
