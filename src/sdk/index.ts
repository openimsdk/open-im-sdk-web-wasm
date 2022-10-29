import { initDatabaseAPI, workerPromise } from '@/api';
import Emitter from '@/utils/emitter';
import { v4 as uuidv4 } from 'uuid';
import { WSEvent } from '../types';
import { getGO, initializeWasm, getGoExitPromsie } from './initialize';

import {
  AdvancedMsgParams,
  AdvancedQuoteMsgParams,
  AtMsgParams,
  CustomMsgParams,
  FaceMessageParams,
  FileMsgFullParams,
  FileMsgParams,
  GetAdvancedHistoryMsgParams,
  GetGroupMemberParams,
  GetHistoryMsgParams,
  GetOneConversationParams,
  GetOneCveParams,
  GroupMsgReadParams,
  ImageMsgParams,
  InsertGroupMsgParams,
  InsertSingleMsgParams,
  LocationMsgParams,
  LoginParam,
  LoginParams,
  MarkC2CParams,
  MarkNotiParams,
  MergerMsgParams,
  PartialUserItem,
  PinCveParams,
  QuoteMsgParams,
  SendMsgParams,
  SetDraftParams,
  setPrvParams,
  SoundMsgParams,
  SouondMsgFullParams,
  SplitParams,
  TypingUpdateParams,
  VideoMsgFullParams,
  VideoMsgParams,
} from '../types/params';

import { IMConfig, WsResponse } from '../types/entity';

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

  async getHistoryMessageListReverse (params: GetHistoryMsgParams, operationID = uuidv4()) {
    return await this._invoker('getHistoryMessageListReverse', window.getHistoryMessageListReverse, [
      operationID,
      JSON.stringify(params),
    ]);
  }
  
  async revokeMessage  (params: string, operationID = uuidv4()) {
    return await this._invoker('revokeMessage ', window.revokeMessage, [
      operationID,
      params,

    ]);
  }

  async setOneConversationPrivateChat  (params: setPrvParams, operationID = uuidv4()) {
    return await this._invoker('setOneConversationPrivateChat ', window.setOneConversationPrivateChat, [
      operationID,
      params.conversationID,
      params.isPrivate,
    ]);
  }
  /* ----------------------------------------------新增-------------------------------------------------------- */
  async getLoginStatus  ( operationID = uuidv4()) {
    return await this._invoker('getLoginStatus ', window.getLoginStatus, [
      operationID,
    ]);
  }
  
  async iLogin  ( data :LoginParams, operationID = uuidv4()) {
    return await this._invoker('iLogin ', window.iLogin, [
      operationID,
      data.token,
      data.userID
    ]);
  }

  async getLoginUser  ( operationID = uuidv4()) {
    return await this._invoker('getLoginUser ', window.getLoginUser, [
      operationID,
    ]);
  }

  async getSelfUserInfo  ( operationID = uuidv4()) {
    return await this._invoker('getSelfUserInfo ', window.getSelfUserInfo, [
      operationID,
    ]);
  }

  async getUsersInfo  ( operationID = uuidv4()) {
    return await this._invoker('getUsersInfo ', window.getUsersInfo, [
      operationID,
    ]);
  }

  async setSelfInfo  (data: PartialUserItem, operationID = uuidv4()) {
    return await this._invoker('setSelfInfo ', window.setSelfInfo, [
      operationID,
      JSON.stringify(data.userInfo)
    ]);
  }

  async createTextAtMessage  (data: AtMsgParams, operationID = uuidv4()) {
    return await this._invoker('createTextAtMessage ', window.createTextAtMessage, [
      operationID,
      data.text,
        JSON.stringify(data.atUsersInfo),
        JSON.stringify(data.atUserIDList),
        data.message
    ]);
  }
  async createSoundMessage  (data: SoundMsgParams, operationID = uuidv4()) {
    return await this._invoker('createSoundMessage ', window.createSoundMessage, [
      operationID,
      data.uuid,
      data.soundPath,
      data.sourceUrl,
        JSON.stringify(data.dataSize),
        JSON.stringify(data.duration),
    ]);
  }

  async createVideoMessage  (data: VideoMsgParams, operationID = uuidv4()) {
    return await this._invoker('createVideoMessage ', window.createVideoMessage, [
      operationID,
        data.videoPath,
        data.duration,
        data.videoType,
        JSON.stringify(data.snapshotPath) ,
        JSON.stringify(data.videoUUID) ,
        data.videoUrl ,
        JSON.stringify(data.videoSize) ,
        data.snapshotUUID,
        JSON.stringify(data.snapshotSize),
        data.snapshotUrl ,
       JSON.stringify( data.snapshotWidth ),
       JSON.stringify( data.snapshotHeight )

    ]);
  }


  async createFileMessage  (data: FileMsgParams, operationID = uuidv4()) {
    return await this._invoker('createFileMessage ', window.createFileMessage, [
      operationID,
      data.filePath,
      data.fileName,
      data.uuid,
      data.sourceUrl,
      JSON.stringify(data.fileSize),
    ]);
  }

  
  async createFileMessageFromFullPath  (data: FileMsgFullParams, operationID = uuidv4()) {
    return await this._invoker('createFileMessageFromFullPath ', window.createFileMessageFromFullPath, [
      operationID,
      data.fileFullPath,
      data.fileName,
    ]);
  }
  
  async createImageMessageFromFullPath  (data: string, operationID = uuidv4()) {
    return await this._invoker('createImageMessageFromFullPath ', window.createImageMessageFromFullPath, [
      operationID,
      data
    ]);
  }
  
  
  async createSoundMessageFromFullPath  (data: SouondMsgFullParams, operationID = uuidv4()) {
    return await this._invoker('createSoundMessageFromFullPath ', window.createSoundMessageFromFullPath, [
      operationID,
      data.soundPath,
      JSON.stringify(data.duration)
    ]);
  }
  


  
  async createVideoMessageFromFullPath  (data: VideoMsgFullParams, operationID = uuidv4()) {
    return await this._invoker('createVideoMessageFromFullPath ', window.createVideoMessageFromFullPath, [
      operationID,
     data.videoFullPath ,
    data. videoType ,
     JSON.stringify( data.duration) ,
     data.snapshotFullPath
    ]);
  }
  
    
  async createMergerMessage  (data: MergerMsgParams, operationID = uuidv4()) {
    return await this._invoker('createMergerMessage ', window.createMergerMessage, [
      operationID,
    JSON.stringify(data.messageList) ,
    data.title ,
    JSON.stringify(data.summaryList)
    ]);
  }

  async createForwardMessage  (data: string, operationID = uuidv4()) {
    return await this._invoker('createForwardMessage ', window.createForwardMessage, [
      operationID,
        data
    ]);
  }
  


  async createFaceMessage  (data: FaceMessageParams, operationID = uuidv4()) {
    return await this._invoker('createFaceMessage ', window.createFaceMessage, [
      operationID,
        JSON.stringify(data.index) ,
        data.data
    ]);
  }
  

  async createLocationMessage  (data: LocationMsgParams, operationID = uuidv4()) {
    return await this._invoker('createLocationMessage ', window.createLocationMessage, [
      operationID,
        data.description,
        JSON.stringify(data.longitude),
        JSON.stringify(data.latitude),
    ]);
  }
  
  async createCardMessage  (data: string, operationID = uuidv4()) {
    return await this._invoker('createCardMessage ', window.createCardMessage, [
      operationID,
    data
    ]);
  }
  
  async deleteMessageFromLocalStorage  (data: string, operationID = uuidv4()) {
    return await this._invoker('deleteMessageFromLocalStorage ', window.deleteMessageFromLocalStorage, [
      operationID,
    data
    ]);
  }
  
  async deleteMessageFromLocalAndSvr  (data: string, operationID = uuidv4()) {
    return await this._invoker('deleteMessageFromLocalAndSvr ', window.deleteMessageFromLocalAndSvr, [
      operationID,
    data
    ]);
  }
  
  async deleteAllConversationFromLocal  ( operationID = uuidv4()) {
    return await this._invoker('deleteAllConversationFromLocal ', window.deleteAllConversationFromLocal, [
      operationID,
    ]);
  }
  
  async deleteAllMsgFromLocal  ( operationID = uuidv4()) {
    return await this._invoker('deleteAllMsgFromLocal ', window.deleteAllMsgFromLocal, [
      operationID,
    ]);
  }
  
  async deleteAllMsgFromLocalAndSvr  ( operationID = uuidv4()) {
    return await this._invoker('deleteAllMsgFromLocalAndSvr ', window.deleteAllMsgFromLocalAndSvr, [
      operationID,
    ]);
  }
  
  async markGroupMessageHasRead  (data : string , operationID = uuidv4()) {
    return await this._invoker('markGroupMessageHasRead ', window.markGroupMessageHasRead, [
      operationID,
      data,
    ]);
  }
  
  async markGroupMessageAsRead  (data : GroupMsgReadParams , operationID = uuidv4()) {
    return await this._invoker('markGroupMessageAsRead ', window.markGroupMessageAsRead, [
      operationID,
      data.groupID,
      JSON.stringify(data.msgIDList)
    ]);
  }
  

  async insertSingleMessageToLocalStorage  (data : InsertSingleMsgParams , operationID = uuidv4()) {
    return await this._invoker('insertSingleMessageToLocalStorage ', window.insertSingleMessageToLocalStorage, [
      operationID,
     data.message,
     data.recvID,
     data.sendID,
    ]);
  }
  
  async insertGroupMessageToLocalStorage  (data : InsertGroupMsgParams , operationID = uuidv4()) {
    return await this._invoker('insertGroupMessageToLocalStorage ', window.insertGroupMessageToLocalStorage, [
      operationID,
        data.message,
        data.groupID,
        data.sendID,
    ]);
  }
  async typingStatusUpdate  (data : TypingUpdateParams , operationID = uuidv4()) {
    return await this._invoker('typingStatusUpdate ', window.typingStatusUpdate, [
      operationID,
        data.recvID,
        data.msgTip
    ]);
  }
  async clearC2CHistoryMessage  (data : string , operationID = uuidv4()) {
    return await this._invoker('clearC2CHistoryMessage ', window.clearC2CHistoryMessage, [
      operationID,
      data 
    ]);
  }
  async clearC2CHistoryMessageFromLocalAndSvr  (data : string , operationID = uuidv4()) {
    return await this._invoker('clearC2CHistoryMessageFromLocalAndSvr ', window.clearC2CHistoryMessageFromLocalAndSvr, [
      operationID,
      data 
    ]);
  }

  async clearGroupHistoryMessage  (data : string , operationID = uuidv4()) {
    return await this._invoker('clearGroupHistoryMessage ', window.clearGroupHistoryMessage, [
      operationID,
      data 
    ]);
  }
  async clearGroupHistoryMessageFromLocalAndSvr  (data : string , operationID = uuidv4()) {
    return await this._invoker('clearGroupHistoryMessageFromLocalAndSvr ', window.clearGroupHistoryMessageFromLocalAndSvr, [
      operationID,
      data 
    ]);
  }
  async getConversationListSplit  (data : SplitParams , operationID = uuidv4()) {
    return await this._invoker('getConversationListSplit ', window.getConversationListSplit, [
      operationID,
      JSON.stringify(data.offset) ,
      JSON.stringify(data.count) 
    ]);
  }
  async getConversationIDBySessionType  (data : GetOneCveParams , operationID = uuidv4()) {
    return await this._invoker('getConversationIDBySessionType ', window.getConversationIDBySessionType, [
      operationID,
        data.sourceID ,
      JSON.stringify(data.sessionType) 
    ]);
  }


  
  async getMultipleConversation  (data : string[] , operationID = uuidv4()) {
    return await this._invoker('getMultipleConversation ', window.getMultipleConversation, [
      operationID,
        JSON.stringify(data)
    ]);
  }

  async deleteConversation  (data : string , operationID = uuidv4()) {
    return await this._invoker('deleteConversation ', window.deleteConversation, [
      operationID,
        data,
    ]);
  }

  async setConversationDraft  (data : SetDraftParams , operationID = uuidv4()) {
    return await this._invoker('setConversationDraft ', window.setConversationDraft, [
      operationID,
        data.conversationID,
    ]);
  }

  async pinConversation  (data : PinCveParams , operationID = uuidv4()) {
    return await this._invoker('pinConversation ', window.pinConversation, [
      operationID,
       JSON.stringify(data.conversationID) ,
       JSON.stringify(data.isPinned)
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
