import { initDatabaseAPI, workerPromise } from '@/api';
import Emitter from '@/utils/emitter';
import { v4 as uuidv4 } from 'uuid';
import { WSEvent } from '../types';
import { getGO, initializeWasm, getGoExitPromsie } from './initialize';

import {
  AccessFriendParams,
  AccessGroupParams,
  AddFriendParams,
  AdvancedMsgParams,
  AdvancedQuoteMsgParams,
  AtMsgParams,
  ChangeGroupMemberMuteParams,
  ChangeGroupMuteParams,
  CreateGroupParams,
  CustomMsgParams,
  FaceMessageParams,
  FileMsgFullParams,
  FileMsgParams,
  FindMessageParams,
  GetAdvancedHistoryMsgParams,
  GetGroupMemberByTimeParams,
  GetGroupMemberParams,
  GetHistoryMsgParams,
  GetOneConversationParams,
  GetOneCveParams,
  GetSubDepParams,
  GroupInfoParams,
  GroupMsgReadParams,
  ImageMsgParams,
  InsertGroupMsgParams,
  InsertSingleMsgParams,
  InviteGroupParams,
  isRecvParams,
  JoinGroupParams,
  LocationMsgParams,
  LoginParam,
  LoginParams,
  MarkC2CParams,
  MarkNotiParams,
  MemberNameParams,
  MergerMsgParams,
  PartialUserItem,
  PinCveParams,
  QuoteMsgParams,
  RemarkFriendParams,
  RtcActionParams,
  SearchFriendParams,
  SearchGroupMemberParams,
  SearchGroupParams,
  SearchInOrzParams,
  SearchLocalParams,
  SendMsgParams,
  SetDraftParams,
  SetGroupRoleParams,
  SetGroupVerificationParams,
  SetMemberAuthParams,
  setPrvParams,
  SoundMsgParams,
  SouondMsgFullParams,
  SplitParams,
  TransferGroupParams,
  TypingUpdateParams,
  VideoMsgFullParams,
  VideoMsgParams,
} from '../types/params';

import { IMConfig, RtcInvite, WsResponse } from '../types/entity';

class SDK extends Emitter {
  private wasmInitializedPromise: Promise<any>;
  private goExitPromise: Promise<void> | undefined;
  private goExisted = false;

  constructor(url = '/main.wasm') {
    super();

    initDatabaseAPI();
    this.wasmInitializedPromise = initializeWasm(url);
    this.goExitPromise = getGoExitPromsie();

    if (this.goExitPromise) {
      this.goExitPromise
        .then(() => {
          console.info('SDK => wasm exist');
        })
        .catch(err => {
          console.info('SDK => wasm with error ', err);
        })
        .finally(() => {
          this.goExisted = true;
        });
    }
  }

  async _invoker(
    functionName: string,
    func: (...args: any[]) => Promise<any>,
    args: any[],
    processor?: (data: string) => string
  ) {
    console.info(
      `SDK => [OperationID:${
        args[0]
      }] (invoked by js) run ${functionName} with args ${JSON.stringify(args)}`
    );

    let response: { data?: any } = {};
    try {
      if (!getGO() || getGO().exited || this.goExisted) {
        throw 'wasm exist already, fail to run';
      }

      let data = await func(...args);
      if (processor) {
        console.info(
          `SDK => [OperationID:${
            args[0]
          }] (invoked by js) run ${functionName} with response before processor ${JSON.stringify(
            data
          )}`
        );
        data = processor(data);
      }
      response = { data };
    } catch (error) {
      console.info(
        `SDK => [OperationID:${
          args[0]
        }] (invoked by js) run ${functionName} with error ${JSON.stringify(
          error
        )}`
      );
    }

    console.info(
      `SDK => [OperationID:${
        args[0]
      }] (invoked by js) run ${functionName} with response ${JSON.stringify(
        response
      )}`
    );

    return response as WsResponse;
  }
  async login(params: LoginParam, operationID = uuidv4()) {
    console.info(
      `SDK => (invoked by js) run login with args ${JSON.stringify({
        params,
        operationID,
      })}`
    );

    await workerPromise;
    await this.wasmInitializedPromise;
    window.commonEventFunc(event => {
      try {
        console.info('SDK => received event ', event);
        const parsed = JSON.parse(event) as WSEvent;

        this.emit(parsed.event, parsed);
      } catch (error) {
        console.error(error);
      }
    });

    const config: IMConfig = {
      platform: params.platformID,
      api_addr: params.apiAddress,
      ws_addr: params.wsAddress,
      log_level: params.logLevel || 6,
    };
    window.initSDK(operationID, JSON.stringify(config));

    return await window.login(operationID, params.userID, params.token);
  }
  async logout(operationID = uuidv4()) {
    return await this._invoker('logout', window.logout, [operationID]);
  }
  async getAllConversationList(operationID = uuidv4()) {
    return await this._invoker(
      'getAllConversationList',
      window.getAllConversationList,
      [operationID]
    );
  }
  async getOneConversation(
    params: GetOneConversationParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getOneConversation',
      window.getOneConversation,
      [operationID, params.sessionType, params.sourceID]
    );
  }
  async getAdvancedHistoryMessageList(
    params: GetAdvancedHistoryMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getAdvancedHistoryMessageList',
      window.getAdvancedHistoryMessageList,
      [operationID, JSON.stringify(params)]
    );
  }
  async getHistoryMessageList(
    params: GetHistoryMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getHistoryMessageList',
      window.getHistoryMessageList,
      [operationID, JSON.stringify(params)]
    );
  }
  async getGroupsInfo(params: string[], operationID = uuidv4()) {
    return await this._invoker('getGroupsInfo', window.getGroupsInfo, [
      operationID,
      JSON.stringify(params),
    ]);
  }
  async deleteConversationFromLocalAndSvr(
    conversationID: string,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'deleteConversationFromLocalAndSvr',
      window.deleteConversationFromLocalAndSvr,
      [operationID, conversationID]
    );
  }
  async markC2CMessageAsRead(params: MarkC2CParams, operationID = uuidv4()) {
    return await this._invoker(
      'markC2CMessageAsRead',
      window.markC2CMessageAsRead,
      [operationID, params.userID, JSON.stringify(params.msgIDList)]
    );
  }
  async markMessageAsReadByConID(
    params: MarkNotiParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'markMessageAsReadByConID',
      window.markMessageAsReadByConID,
      [operationID, params.conversationID, JSON.stringify(params.msgIDList)]
    );
  }
  async markNotifyMessageHasRead(
    conversationID: string,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'markNotifyMessageHasRead',
      window.markNotifyMessageHasRead,
      [operationID, conversationID, '[]']
    );
  }
  async getGroupMemberList(
    params: GetGroupMemberParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getGroupMemberList',
      window.getGroupMemberList,
      [operationID, params.groupID, params.filter, params.offset, params.count]
    );
  }
  async createTextMessage(text: string, operationID = uuidv4()) {
    return await this._invoker(
      'createTextMessage',
      window.createTextMessage,
      [operationID, text],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async createImageMessage(params: ImageMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createImageMessage',
      window.createImageMessageByURL,
      [
        operationID,
        JSON.stringify(params.sourcePicture),
        JSON.stringify(params.bigPicture),
        JSON.stringify(params.snapshotPicture),
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async createCustomMessage(params: CustomMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createCustomMessage',
      window.createCustomMessage,
      [operationID, params.data, params.extension, params.description],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async createQuoteMessage(params: QuoteMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createQuoteMessage',
      window.createQuoteMessage,
      [operationID, params.text, params.message],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async createAdvancedQuoteMessage(
    params: AdvancedQuoteMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'createAdvancedQuoteMessage',
      window.createAdvancedQuoteMessage,
      [
        operationID,
        params.text,
        params.message,
        JSON.stringify(params.messageEntityList),
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async createAdvancedTextMessage(
    params: AdvancedMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'createAdvancedTextMessage',
      window.createAdvancedTextMessage,
      [operationID, params.text, JSON.stringify(params.messageEntityList)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async sendMessage(params: SendMsgParams, operationID = uuidv4()) {
    return await this._invoker('sendMessage', window.sendMessage, [
      operationID,
      params.message,
      params.recvID,
      params.groupID,
      JSON.stringify(params.offlinePushInfo),
    ]);
  }
  async sendMessageNotOss(params: SendMsgParams, operationID = uuidv4()) {
    return await this._invoker('sendMessageNotOss', window.sendMessageNotOss, [
      operationID,
      params.message,
      params.recvID,
      params.groupID,
      JSON.stringify(params.offlinePushInfo),
    ]);
  }
  
    async exportDB(operationID = uuidv4()) {
    return await this._invoker('exportDB', window.exportDB, [operationID]);

  async getHistoryMessageListReverse(
    params: GetHistoryMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getHistoryMessageListReverse',
      window.getHistoryMessageListReverse,
      [operationID, JSON.stringify(params)]
    );
  }

  async revokeMessage(params: string, operationID = uuidv4()) {
    return await this._invoker('revokeMessage', window.revokeMessage, [
      operationID,
      params,
    ]);
  }

  async setOneConversationPrivateChat(
    params: setPrvParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setOneConversationPrivateChat',
      window.setOneConversationPrivateChat,
      [operationID, params.conversationID, params.isPrivate]
    );
  }
  /* ----------------------------------------------新增-------------------------------------------------------- */
  async getLoginStatus(operationID = uuidv4()) {
    return await this._invoker('getLoginStatus', window.getLoginStatus, [
      operationID,
    ]);
  }

  // async iLogin(data: LoginParams, operationID = uuidv4()) {
  //   return await this._invoker('iLogin', window.iLogin, [
  //     operationID,
  //     data.token,
  //     data.userID,
  //   ]);
  // }

  async getLoginUser(operationID = uuidv4()) {
    return await this._invoker('getLoginUser', window.getLoginUser, [
      operationID,
    ]);
  }

  async getSelfUserInfo(operationID = uuidv4()) {
    return await this._invoker('getSelfUserInfo', window.getSelfUserInfo, [
      operationID,
    ]);
  }

  async getUsersInfo(data: string[], operationID = uuidv4()) {
    return await this._invoker('getUsersInfo', window.getUsersInfo, [
      operationID,
      JSON.stringify(data),
    ]);
  }

  async setSelfInfo(data: PartialUserItem, operationID = uuidv4()) {
    return await this._invoker('setSelfInfo', window.setSelfInfo, [
      operationID,
      JSON.stringify(data),
    ]);
  }

  async createTextAtMessage(data: AtMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createTextAtMessage',
      window.createTextAtMessage,
      [
        operationID,
        data.text,
        JSON.stringify(data.atUserIDList),
        JSON.stringify(data.atUsersInfo),
        data.message,
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }
  async createSoundMessage(data: SoundMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createSoundMessage',
      window.createSoundMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createVideoMessage(data: VideoMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createVideoMessage',
      window.createVideoMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createFileMessage(data: FileMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createFileMessage',
      window.createFileMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createFileMessageFromFullPath(
    data: FileMsgFullParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'createFileMessageFromFullPath',
      window.createFileMessageFromFullPath,
      [operationID, data.fileFullPath, data.fileName],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createImageMessageFromFullPath(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'createImageMessageFromFullPath ',
      window.createImageMessageFromFullPath,
      [operationID, data],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createSoundMessageFromFullPath(
    data: SouondMsgFullParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'createSoundMessageFromFullPath ',
      window.createSoundMessageFromFullPath,
      [operationID, data.soundPath, data.duration],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createVideoMessageFromFullPath(
    data: VideoMsgFullParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'createVideoMessageFromFullPath ',
      window.createVideoMessageFromFullPath,
      [
        operationID,
        data.videoFullPath,
        data.videoType,
        data.duration,
        data.snapshotFullPath,
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createMergerMessage(data: MergerMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createMergerMessage ',
      window.createMergerMessage,
      [
        operationID,
        JSON.stringify(data.messageList),
        data.title,
        JSON.stringify(data.summaryList),
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createForwardMessage(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'createForwardMessage ',
      window.createForwardMessage,
      [operationID, data],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createFaceMessage(data: FaceMessageParams, operationID = uuidv4()) {
    return await this._invoker(
      'createFaceMessage ',
      window.createFaceMessage,
      [operationID, data.index, data.data],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createLocationMessage(data: LocationMsgParams, operationID = uuidv4()) {
    return await this._invoker(
      'createLocationMessage ',
      window.createLocationMessage,
      [operationID, data.description, data.longitude, data.latitude],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async createCardMessage(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'createCardMessage ',
      window.createCardMessage,
      [operationID, data],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  }

  async deleteMessageFromLocalStorage(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'deleteMessageFromLocalStorage ',
      window.deleteMessageFromLocalStorage,
      [operationID, data]
    );
  }

  async deleteMessageFromLocalAndSvr(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'deleteMessageFromLocalAndSvr ',
      window.deleteMessageFromLocalAndSvr,
      [operationID, data]
    );
  }

  async deleteAllConversationFromLocal(operationID = uuidv4()) {
    return await this._invoker(
      'deleteAllConversationFromLocal ',
      window.deleteAllConversationFromLocal,
      [operationID]
    );
  }

  async deleteAllMsgFromLocal(operationID = uuidv4()) {
    return await this._invoker(
      'deleteAllMsgFromLocal ',
      window.deleteAllMsgFromLocal,
      [operationID]
    );
  }

  async deleteAllMsgFromLocalAndSvr(operationID = uuidv4()) {
    return await this._invoker(
      'deleteAllMsgFromLocalAndSvr ',
      window.deleteAllMsgFromLocalAndSvr,
      [operationID]
    );
  }

  async markGroupMessageHasRead(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'markGroupMessageHasRead ',
      window.markGroupMessageHasRead,
      [operationID, data]
    );
  }

  async markGroupMessageAsRead(
    data: GroupMsgReadParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'markGroupMessageAsRead ',
      window.markGroupMessageAsRead,
      [operationID, data.groupID, JSON.stringify(data.msgIDList)]
    );
  }

  async insertSingleMessageToLocalStorage(
    data: InsertSingleMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'insertSingleMessageToLocalStorage ',
      window.insertSingleMessageToLocalStorage,
      [operationID, data.message, data.recvID, data.sendID]
    );
  }

  async insertGroupMessageToLocalStorage(
    data: InsertGroupMsgParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'insertGroupMessageToLocalStorage ',
      window.insertGroupMessageToLocalStorage,
      [operationID, data.message, data.groupID, data.sendID]
    );
  }
  async typingStatusUpdate(data: TypingUpdateParams, operationID = uuidv4()) {
    return await this._invoker(
      'typingStatusUpdate ',
      window.typingStatusUpdate,
      [operationID, data.recvID, data.msgTip]
    );
  }
  async clearC2CHistoryMessage(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'clearC2CHistoryMessage ',
      window.clearC2CHistoryMessage,
      [operationID, data]
    );
  }
  async clearC2CHistoryMessageFromLocalAndSvr(
    data: string,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'clearC2CHistoryMessageFromLocalAndSvr ',
      window.clearC2CHistoryMessageFromLocalAndSvr,
      [operationID, data]
    );
  }

  async clearGroupHistoryMessage(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'clearGroupHistoryMessage ',
      window.clearGroupHistoryMessage,
      [operationID, data]
    );
  }
  async clearGroupHistoryMessageFromLocalAndSvr(
    data: string,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'clearGroupHistoryMessageFromLocalAndSvr ',
      window.clearGroupHistoryMessageFromLocalAndSvr,
      [operationID, data]
    );
  }
  async getConversationListSplit(data: SplitParams, operationID = uuidv4()) {
    return await this._invoker(
      'getConversationListSplit ',
      window.getConversationListSplit,
      [operationID, data.offset, data.count]
    );
  }
  async getConversationIDBySessionType(
    data: GetOneCveParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getConversationIDBySessionType ',
      window.getConversationIDBySessionType,
      [operationID, data.sourceID, data.sessionType]
    );
  }

  async getMultipleConversation(data: string[], operationID = uuidv4()) {
    return await this._invoker(
      'getMultipleConversation ',
      window.getMultipleConversation,
      [operationID, JSON.stringify(data)]
    );
  }

  async deleteConversation(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'deleteConversation ',
      window.deleteConversation,
      [operationID, data]
    );
  }

  async setConversationDraft(data: SetDraftParams, operationID = uuidv4()) {
    return await this._invoker(
      'setConversationDraft ',
      window.setConversationDraft,
      [operationID, data.conversationID]
    );
  }

  async pinConversation(data: PinCveParams, operationID = uuidv4()) {
    return await this._invoker('pinConversation ', window.pinConversation, [
      operationID,
      data.conversationID,
      data.isPinned,
    ]);
  }
  async getTotalUnreadMsgCount(operationID = uuidv4()) {
    return await this._invoker(
      'getTotalUnreadMsgCount ',
      window.getTotalUnreadMsgCount,
      [operationID]
    );
  }
  async getConversationRecvMessageOpt(data: string[], operationID = uuidv4()) {
    return await this._invoker(
      'getConversationRecvMessageOpt ',
      window.getConversationRecvMessageOpt,
      [operationID, JSON.stringify(data)]
    );
  }
  async setConversationRecvMessageOpt(
    data: isRecvParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setConversationRecvMessageOpt ',
      window.setConversationRecvMessageOpt,
      [operationID, JSON.stringify(data.conversationIDList), data.opt]
    );
  }
  async searchLocalMessages(data: SearchLocalParams, operationID = uuidv4()) {
    return await this._invoker(
      'searchLocalMessages ',
      window.searchLocalMessages,
      [operationID, JSON.stringify(data)]
    );
  }
  async addFriend(data: AddFriendParams, operationID = uuidv4()) {
    return await this._invoker('addFriend ', window.addFriend, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async searchFriends(data: SearchFriendParams, operationID = uuidv4()) {
    return await this._invoker('searchFriends ', window.searchFriends, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async getDesignatedFriendsInfo(data: string[], operationID = uuidv4()) {
    return await this._invoker(
      'getDesignatedFriendsInfo ',
      window.getDesignatedFriendsInfo,
      [operationID, JSON.stringify(data)]
    );
  }
  async getRecvFriendApplicationList(operationID = uuidv4()) {
    return await this._invoker(
      'getRecvFriendApplicationList ',
      window.getRecvFriendApplicationList,
      [operationID]
    );
  }
  async getSendFriendApplicationList(operationID = uuidv4()) {
    return await this._invoker(
      'getSendFriendApplicationList ',
      window.getSendFriendApplicationList,
      [operationID]
    );
  }
  async getFriendList(operationID = uuidv4()) {
    return await this._invoker('getFriendList ', window.getFriendList, [
      operationID,
    ]);
  }
  async setFriendRemark(data: RemarkFriendParams, operationID = uuidv4()) {
    return await this._invoker('setFriendRemark ', window.setFriendRemark, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async checkFriend(data: string[], operationID = uuidv4()) {
    return await this._invoker('checkFriend', window.checkFriend, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async acceptFriendApplication(
    data: AccessFriendParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'acceptFriendApplication',
      window.acceptFriendApplication,
      [operationID, JSON.stringify(data)]
    );
  }
  async refuseFriendApplication(
    data: AccessFriendParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'refuseFriendApplication ',
      window.refuseFriendApplication,
      [operationID, JSON.stringify(data)]
    );
  }
  async deleteFriend(data: string, operationID = uuidv4()) {
    return await this._invoker('deleteFriend ', window.deleteFriend, [
      operationID,
      data,
    ]);
  }
  async addBlack(data: string, operationID = uuidv4()) {
    return await this._invoker('addBlack ', window.addBlack, [
      operationID,
      data,
    ]);
  }
  async removeBlack(data: string, operationID = uuidv4()) {
    return await this._invoker('removeBlack ', window.removeBlack, [
      operationID,
      data,
    ]);
  }
  async getBlackList(operationID = uuidv4()) {
    return await this._invoker('getBlackList ', window.getBlackList, [
      operationID,
    ]);
  }
  async inviteUserToGroup(data: InviteGroupParams, operationID = uuidv4()) {
    return await this._invoker('inviteUserToGroup ', window.inviteUserToGroup, [
      operationID,
      data.groupID,
      data.reason,
      JSON.stringify(data.userIDList),
    ]);
  }
  async kickGroupMember(data: InviteGroupParams, operationID = uuidv4()) {
    return await this._invoker('kickGroupMember ', window.kickGroupMember, [
      operationID,
      data.groupID,
      data.reason,
      JSON.stringify(data.userIDList),
    ]);
  }
  /* 、、、、、、、、、、、、、、、、周一问 */
  async getGroupMembersInfo(
    data: Omit<InviteGroupParams, 'reason'>,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getGroupMembersInfo ',
      window.getGroupMembersInfo,
      [operationID, data.groupID, JSON.stringify(data.userIDList)]
    );
  }
  async getGroupMemberListByJoinTimeFilter(
    data: GetGroupMemberByTimeParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getGroupMemberListByJoinTimeFilter ',
      window.getGroupMemberListByJoinTimeFilter,
      [
        operationID,
        data.groupID,
        data.offset,
        data.count,
        data.joinTimeBegin,
        data.joinTimeEnd,
        JSON.stringify(data.filterUserIDList),
      ]
    );
  }
  async searchGroupMembers(
    data: SearchGroupMemberParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'searchGroupMembers ',
      window.searchGroupMembers,
      [operationID, JSON.stringify(data)]
    );
  }
  async setGroupApplyMemberFriend(
    data: SetMemberAuthParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setGroupApplyMemberFriend ',
      window.setGroupApplyMemberFriend,
      [operationID, data.groupID, data.rule]
    );
  }
  async setGroupLookMemberInfo(
    data: SetMemberAuthParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setGroupLookMemberInfo ',
      window.setGroupLookMemberInfo,
      [operationID, data.groupID, data.rule]
    );
  }
  async getJoinedGroupList(operationID = uuidv4()) {
    return await this._invoker(
      'getJoinedGroupList ',
      window.getJoinedGroupList,
      [operationID]
    );
  }
  async createGroup(data: CreateGroupParams, operationID = uuidv4()) {
    return await this._invoker('createGroup ', window.createGroup, [
      operationID,
      JSON.stringify(data.groupBaseInfo),
      JSON.stringify(data.memberList),
    ]);
  }
  async setGroupInfo(data: GroupInfoParams, operationID = uuidv4()) {
    return await this._invoker('setGroupInfo ', window.setGroupInfo, [
      operationID,
      data.groupID,
      JSON.stringify(data.groupInfo),
    ]);
  }
  async setGroupMemberNickname(data: MemberNameParams, operationID = uuidv4()) {
    return await this._invoker(
      'setGroupMemberNickname ',
      window.setGroupMemberNickname,
      [operationID, data.groupID, data.userID, data.GroupMemberNickname]
    );
  }
  async joinGroup(data: JoinGroupParams, operationID = uuidv4()) {
    return await this._invoker('joinGroup ', window.joinGroup, [
      operationID,
      data.groupID,
      data.reqMsg,
      JSON.stringify(data.joinSource),
    ]);
  }
  async searchGroups(data: SearchGroupParams, operationID = uuidv4()) {
    return await this._invoker('searchGroups ', window.searchGroups, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async quitGroup(data: string, operationID = uuidv4()) {
    return await this._invoker('quitGroup ', window.quitGroup, [
      operationID,
      data,
    ]);
  }
  async dismissGroup(data: string, operationID = uuidv4()) {
    return await this._invoker('dismissGroup ', window.dismissGroup, [
      operationID,
      data,
    ]);
  }
  async changeGroupMute(data: ChangeGroupMuteParams, operationID = uuidv4()) {
    return await this._invoker('changeGroupMute ', window.changeGroupMute, [
      operationID,
      data.groupID,
      data.isMute,
    ]);
  }
  async changeGroupMemberMute(
    data: ChangeGroupMemberMuteParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'changeGroupMemberMute ',
      window.changeGroupMemberMute,
      [operationID, data.groupID, data.userID, data.mutedSeconds]
    );
  }
  async transferGroupOwner(data: TransferGroupParams, operationID = uuidv4()) {
    return await this._invoker(
      'transferGroupOwner ',
      window.transferGroupOwner,
      [operationID, data.groupID, data.newOwnerUserID]
    );
  }
  async getSendGroupApplicationList(operationID = uuidv4()) {
    return await this._invoker(
      'getSendGroupApplicationList ',
      window.getSendGroupApplicationList,
      [operationID]
    );
  }
  async getRecvGroupApplicationList(operationID = uuidv4()) {
    return await this._invoker(
      'getRecvGroupApplicationList ',
      window.getRecvGroupApplicationList,
      [operationID]
    );
  }
  async acceptGroupApplication(
    data: AccessGroupParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'acceptGroupApplication ',
      window.acceptGroupApplication,
      [operationID, data.groupID, data.fromUserID, data.handleMsg]
    );
  }
  async refuseGroupApplication(
    data: AccessGroupParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'refuseGroupApplication ',
      window.refuseGroupApplication,
      [operationID, data.groupID, data.fromUserID, data.handleMsg]
    );
  }
  async signalingInvite(data: RtcInvite, operationID = uuidv4()) {
    return await this._invoker('signalingInvite ', window.signalingInvite, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async signalingInviteInGroup(data: RtcInvite, operationID = uuidv4()) {
    return await this._invoker(
      'signalingInviteInGroup ',
      window.signalingInviteInGroup,
      [operationID, JSON.stringify(data)]
    );
  }
  async signalingAccept(data: RtcActionParams, operationID = uuidv4()) {
    return await this._invoker('signalingAccept ', window.signalingAccept, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async signalingReject(data: RtcActionParams, operationID = uuidv4()) {
    return await this._invoker('signalingReject ', window.signalingReject, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async signalingCancel(data: RtcActionParams, operationID = uuidv4()) {
    return await this._invoker('signalingCancel ', window.signalingCancel, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async signalingHungUp(data: RtcActionParams, operationID = uuidv4()) {
    return await this._invoker('signalingHungUp ', window.signalingHungUp, [
      operationID,
      JSON.stringify(data),
    ]);
  }
  async getSubDepartment(data: GetSubDepParams, operationID = uuidv4()) {
    return await this._invoker('getSubDepartment ', window.getSubDepartment, [
      operationID,
      data.departmentID,
      data.offset,
      data.count,
    ]);
  }
  async getDepartmentMember(data: GetSubDepParams, operationID = uuidv4()) {
    return await this._invoker(
      'getDepartmentMember ',
      window.getDepartmentMember,
      [operationID, data.departmentID, data.offset, data.count]
    );
  }
  async getUserInDepartment(userID: string, operationID = uuidv4()) {
    return await this._invoker(
      'getUserInDepartment ',
      window.getUserInDepartment,
      [operationID, userID]
    );
  }
  async getDepartmentMemberAndSubDepartment(
    departmentID: string,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'getDepartmentMemberAndSubDepartment ',
      window.getDepartmentMemberAndSubDepartment,
      [operationID, departmentID]
    );
  }
  async getDepartmentInfo(departmentID: string, operationID = uuidv4()) {
    return await this._invoker('getDepartmentInfo ', window.getDepartmentInfo, [
      operationID,
      departmentID,
    ]);
  }
  async searchOrganization(data: SearchInOrzParams, operationID = uuidv4()) {
    return await this._invoker(
      'searchOrganization ',
      window.searchOrganization,
      [operationID, JSON.stringify(data.input), data.offset, data.count]
    );
  }
  async resetConversationGroupAtType(data: string, operationID = uuidv4()) {
    return await this._invoker(
      'resetConversationGroupAtType ',
      window.resetConversationGroupAtType,
      [operationID, data]
    );
  }
  async setGroupMemberRoleLevel(
    data: SetGroupRoleParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setGroupMemberRoleLevel ',
      window.setGroupMemberRoleLevel,
      [operationID, data.groupID, data.userID, data.roleLevel]
    );
  }
  async setGroupVerification(
    data: SetGroupVerificationParams,
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setGroupVerification ',
      window.setGroupVerification,
      [operationID, data.groupID, data.verification]
    );
  }
  async setGlobalRecvMessageOpt(
    data: { opt: OptType },
    operationID = uuidv4()
  ) {
    return await this._invoker(
      'setGlobalRecvMessageOpt ',
      window.setGlobalRecvMessageOpt,
      [operationID, data.opt]
    );
  }
  async newRevokeMessage(data: string, operationID = uuidv4()) {
    return await this._invoker('newRevokeMessage ', window.newRevokeMessage, [
      operationID,
      data,
    ]);
  }
  async findMessageList(data: FindMessageParams, operationID = uuidv4()) {
    return await this._invoker('findMessageList ', window.findMessageList, [
      operationID,
      JSON.stringify(data),
    ]);
  }
}

let instance: SDK;

export function getSDK(url = '/main.wasm'): SDK {
  if (typeof window === 'undefined') {
    return {} as SDK;
  }

  if (instance) {
    return instance;
  }

  instance = new SDK(url);

  return instance;
}
