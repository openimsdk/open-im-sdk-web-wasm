import {
  fileMapClear,
  fileMapSet,
  initDatabaseAPI,
  workerPromise,
} from '@/api';
import Emitter from '@/utils/emitter';
import { v4 as uuidv4 } from 'uuid';
import { getGO, initializeWasm, getGoExitPromsie } from './initialize';

import {
  AccessFriendParams,
  AccessGroupParams,
  AccessMessageParams,
  AddFriendParams,
  AdvancedMsgParams,
  AdvancedQuoteMsgParams,
  AtMsgParams,
  ChangeGroupMemberMuteParams,
  ChangeGroupMuteParams,
  CreateGroupParams,
  CreateMeetingParams,
  CustomMsgParams,
  CustomSignalParams,
  FaceMessageParams,
  FileMsgFullParams,
  FileMsgParams,
  FindMessageParams,
  GetAdvancedHistoryMsgParams,
  GetGroupMemberByTimeParams,
  GetGroupMemberParams,
  GetGroupMessageReaderParams,
  GetHistoryMsgParams,
  GetOneConversationParams,
  GetOneCveParams,
  GetUserInfoWithCacheParams,
  ImageMsgParams,
  InitAndLoginConfig,
  InsertGroupMsgParams,
  InsertSingleMsgParams,
  InviteGroupParams,
  isRecvParams,
  JoinGroupParams,
  LocationMsgParams,
  MarkNotiParams,
  MeetingOperateStreamParams,
  UpdateMemberInfoParams,
  MergerMsgParams,
  PartialUserItem,
  PinCveParams,
  QuoteMsgParams,
  RemarkFriendParams,
  RtcActionParams,
  SearchFriendParams,
  SearchGroupMemberParams,
  SearchGroupParams,
  SearchLocalParams,
  SendGroupReadReceiptParams,
  SendMsgParams,
  SetBurnDurationParams,
  SetConversationMsgDestructParams,
  SetConversationMsgDestructTimeParams,
  SetDraftParams,
  SetGroupRoleParams,
  SetGroupVerificationParams,
  SetMemberAuthParams,
  SetMessageLocalExParams,
  SetPrvParams,
  SignalingInviteParams,
  SoundMsgParams,
  SouondMsgFullParams,
  SplitParams,
  TransferGroupParams,
  TypingUpdateParams,
  UpdateMeetingParams,
  UploadFileParams,
  VideoMsgFullParams,
  VideoMsgParams,
  MemberNameParams,
} from '../types/params';

import {
  AdvancedGetMessageResult,
  BlackUserItem,
  CardElem,
  ConversationItem,
  FriendApplicationItem,
  FriendshipInfo,
  FriendUserItem,
  FullUserItem,
  FullUserItemWithCache,
  GroupApplicationItem,
  GroupItem,
  GroupMemberItem,
  IMConfig,
  MessageItem,
  SearchedFriendsInfo,
  SearchMessageResult,
  SelfUserInfo,
  UserOnlineState,
  WSEvent,
  WsResponse,
} from '../types/entity';
import { LoginStatus, MessageReceiveOptType } from '@/types/enum';
import { logBoxStyleValue } from '@/utils';
class SDK extends Emitter {
  private wasmInitializedPromise: Promise<any>;
  private goExitPromise: Promise<void> | undefined;
  private goExisted = false;
  private tryParse = true;
  private isLogStandardOutput = true;

  constructor(url = '/openIM.wasm') {
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

  _logWrap(...args: any[]) {
    if (this.isLogStandardOutput) {
      console.info(...args);
    }
  }

  _invoker<T>(
    functionName: string,
    func: (...args: any[]) => Promise<any>,
    args: any[],
    processor?: (data: string) => string
  ): Promise<WsResponse<T>> {
    return new Promise(async (resolve, reject) => {
      this._logWrap(
        `%cSDK =>%c [OperationID:${
          args[0]
        }] (invoked by js) run ${functionName} with args ${JSON.stringify(
          args
        )}`,
        'font-size:14px; background:#7CAEFF; border-radius:4px; padding-inline:4px;',
        ''
      );

      let response = {
        operationID: args[0],
        event: (functionName.slice(0, 1).toUpperCase() +
          functionName.slice(1).toLowerCase()) as any,
      } as WsResponse<T>;
      try {
        if (!getGO() || getGO().exited || this.goExisted) {
          throw 'wasm exist already, fail to run';
        }

        let data = await func(...args);
        if (processor) {
          this._logWrap(
            `%cSDK =>%c [OperationID:${
              args[0]
            }] (invoked by js) run ${functionName} with response before processor ${JSON.stringify(
              data
            )}`,
            logBoxStyleValue('#FFDC19'),
            ''
          );
          data = processor(data);
        }

        if (this.tryParse) {
          try {
            data = JSON.parse(data);
          } catch (error) {
            // parse error
          }
        }
        response.data = data;
        resolve(response);
      } catch (error) {
        this._logWrap(
          `%cSDK =>%c [OperationID:${
            args[0]
          }] (invoked by js) run ${functionName} with error ${JSON.stringify(
            error
          )}`,
          logBoxStyleValue('#EE4245'),
          ''
        );
        response = {
          ...response,
          ...(error as WsResponse<T>),
        };
        reject(response);
      }
    });
  }
  login = async (params: InitAndLoginConfig, operationID = uuidv4()) => {
    this._logWrap(
      `SDK => (invoked by js) run login with args ${JSON.stringify({
        params,
        operationID,
      })}`
    );

    await workerPromise;
    await this.wasmInitializedPromise;
    window.commonEventFunc(event => {
      try {
        console.info(
          `%cSDK =>%c received event %c${event}%c `,
          logBoxStyleValue('#282828', '#ffffff'),
          '',
          'color: #4f2398;',
          ''
        );
        const parsed = JSON.parse(event) as WSEvent;
        if (this.tryParse) {
          try {
            parsed.data = JSON.parse(parsed.data as string);
          } catch (error) {
            // parse error
          }
        }

        this.emit(parsed.event, parsed);
      } catch (error) {
        console.error(error);
      }
    });

    const config: IMConfig = {
      platformID: params.platformID,
      apiAddr: params.apiAddr,
      wsAddr: params.wsAddr,
      dataDir: './',
      logLevel: params.logLevel || 5,
      isLogStandardOutput: params.isLogStandardOutput ?? true,
      logFilePath: './',
      isExternalExtensions: params.isExternalExtensions || false,
    };
    this.tryParse = params.tryParse ?? true;
    this.isLogStandardOutput = config.isLogStandardOutput;
    window.initSDK(operationID, JSON.stringify(config));
    return await window.login(operationID, params.userID, params.token);
  };
  logout = <T>(operationID = uuidv4()) => {
    fileMapClear();
    return this._invoker<T>('logout', window.logout, [operationID]);
  };
  getAllConversationList = (operationID = uuidv4()) => {
    return this._invoker<ConversationItem[]>(
      'getAllConversationList',
      window.getAllConversationList,
      [operationID]
    );
  };
  getOneConversation = (
    params: GetOneConversationParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<ConversationItem>(
      'getOneConversation',
      window.getOneConversation,
      [operationID, params.sessionType, params.sourceID]
    );
  };
  getAdvancedHistoryMessageList = (
    params: GetAdvancedHistoryMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<AdvancedGetMessageResult>(
      'getAdvancedHistoryMessageList',
      window.getAdvancedHistoryMessageList,
      [operationID, JSON.stringify(params)]
    );
  };
  getAdvancedHistoryMessageListReverse = (
    params: GetAdvancedHistoryMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<AdvancedGetMessageResult>(
      'getAdvancedHistoryMessageListReverse',
      window.getAdvancedHistoryMessageListReverse,
      [operationID, JSON.stringify(params)]
    );
  };
  getSpecifiedGroupsInfo = (params: string[], operationID = uuidv4()) => {
    return this._invoker<GroupItem[]>(
      'getSpecifiedGroupsInfo',
      window.getSpecifiedGroupsInfo,
      [operationID, JSON.stringify(params)]
    );
  };
  deleteConversationAndDeleteAllMsg = <T>(
    conversationID: string,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'deleteConversationAndDeleteAllMsg',
      window.deleteConversationAndDeleteAllMsg,
      [operationID, conversationID]
    );
  };
  markConversationMessageAsRead = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>(
      'markConversationMessageAsRead',
      window.markConversationMessageAsRead,
      [operationID, data]
    );
  };
  markMessagesAsReadByMsgID = <T>(
    params: MarkNotiParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'markMessagesAsReadByMsgID',
      window.markMessagesAsReadByMsgID,
      [
        operationID,
        params.conversationID,
        JSON.stringify(params.clientMsgIDList),
      ]
    );
  };
  sendGroupMessageReadReceipt = <T>(
    params: SendGroupReadReceiptParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'sendGroupMessageReadReceipt',
      window.sendGroupMessageReadReceipt,
      [
        operationID,
        params.conversationID,
        JSON.stringify(params.clientMsgIDList),
      ]
    );
  };
  getGroupMessageReaderList = <T>(
    params: GetGroupMessageReaderParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'getGroupMessageReaderList',
      window.getGroupMessageReaderList,
      [
        operationID,
        params.conversationID,
        params.clientMsgID,
        params.filter,
        params.offset,
        params.count,
      ]
    );
  };
  getGroupMemberList = (
    params: GetGroupMemberParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<GroupMemberItem[]>(
      'getGroupMemberList',
      window.getGroupMemberList,
      [operationID, params.groupID, params.filter, params.offset, params.count]
    );
  };
  createTextMessage = (text: string, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createTextMessage',
      window.createTextMessage,
      [operationID, text],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createImageMessage = (params: ImageMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
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
  };
  createImageMessageByFile = <T>(
    params: ImageMsgParams & { file: File },
    operationID = uuidv4()
  ) => {
    params.sourcePicture.uuid = `${params.sourcePicture.uuid}/${params.file.name}`;
    fileMapSet(params.sourcePicture.uuid, params.file);
    return this._invoker<T>(
      'createImageMessageByFile',
      window.createImageMessageByURL,
      [
        operationID,
        params.sourcePath,
        JSON.stringify(params.sourcePicture),
        JSON.stringify(params.bigPicture),
        JSON.stringify(params.snapshotPicture),
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createCustomMessage = (params: CustomMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createCustomMessage',
      window.createCustomMessage,
      [operationID, params.data, params.extension, params.description],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createQuoteMessage = (params: QuoteMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createQuoteMessage',
      window.createQuoteMessage,
      [operationID, params.text, params.message],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createAdvancedQuoteMessage = (
    params: AdvancedQuoteMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<MessageItem>(
      'createAdvancedQuoteMessage',
      window.createAdvancedQuoteMessage,
      [
        operationID,
        params.text,
        JSON.stringify(params.message),
        JSON.stringify(params.messageEntityList),
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createAdvancedTextMessage = (
    params: AdvancedMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<MessageItem>(
      'createAdvancedTextMessage',
      window.createAdvancedTextMessage,
      [operationID, params.text, JSON.stringify(params.messageEntityList)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  sendMessage = (params: SendMsgParams, operationID = uuidv4()) => {
    const offlinePushInfo = params.offlinePushInfo ?? {
      title: '你有一条新消息',
      desc: '',
      ex: '',
      iOSPushSound: '+1',
      iOSBadgeCount: true,
    };
    return this._invoker<MessageItem>('sendMessage', window.sendMessage, [
      operationID,
      JSON.stringify(params.message),
      params.recvID,
      params.groupID,
      JSON.stringify(offlinePushInfo),
    ]);
  };
  sendMessageNotOss = (params: SendMsgParams, operationID = uuidv4()) => {
    const offlinePushInfo = params.offlinePushInfo ?? {
      title: '你有一条新消息',
      desc: '',
      ex: '',
      iOSPushSound: '+1',
      iOSBadgeCount: true,
    };
    return this._invoker<MessageItem>(
      'sendMessageNotOss',
      window.sendMessageNotOss,
      [
        operationID,
        JSON.stringify(params.message),
        params.recvID,
        params.groupID,
        JSON.stringify(offlinePushInfo),
      ]
    );
  };
  sendMessageByBuffer = <T>(params: SendMsgParams, operationID = uuidv4()) => {
    const offlinePushInfo = params.offlinePushInfo ?? {
      title: '你有一条新消息',
      desc: '',
      ex: '',
      iOSPushSound: '+1',
      iOSBadgeCount: true,
    };
    return this._invoker<T>('sendMessageByBuffer', window.sendMessageByBuffer, [
      operationID,
      JSON.stringify(params.message),
      params.recvID,
      params.groupID,
      JSON.stringify(offlinePushInfo),
      params.fileArrayBuffer,
      params.snpFileArrayBuffer,
    ]);
  };

  setMessageLocalEx = <T>(
    params: SetMessageLocalExParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('setMessageLocalEx', window.setMessageLocalEx, [
      operationID,
      params.conversationID,
      params.clientMsgID,
      params.localEx,
    ]);
  };

  exportDB(operationID = uuidv4()) {
    return this._invoker('exportDB', window.exportDB, [operationID]);
  }

  getHistoryMessageListReverse = <T>(
    params: GetHistoryMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'getHistoryMessageListReverse',
      window.getHistoryMessageListReverse,
      [operationID, JSON.stringify(params)]
    );
  };

  revokeMessage = <T>(data: AccessMessageParams, operationID = uuidv4()) => {
    return this._invoker<T>('revokeMessage', window.revokeMessage, [
      operationID,
      data.conversationID,
      data.clientMsgID,
    ]);
  };

  setConversationPrivateChat = <T>(
    params: SetPrvParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setConversationPrivateChat',
      window.setConversationPrivateChat,
      [operationID, params.conversationID, params.isPrivate]
    );
  };

  setConversationBurnDuration = <T>(
    params: SetBurnDurationParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setConversationBurnDuration',
      window.setConversationBurnDuration,
      [operationID, params.conversationID, params.burnDuration]
    );
  };

  getLoginStatus = (operationID = uuidv4()) => {
    return this._invoker<LoginStatus>(
      'getLoginStatus',
      window.getLoginStatus,
      [operationID],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  setAppBackgroundStatus = <T>(data: boolean, operationID = uuidv4()) => {
    return this._invoker<T>(
      'setAppBackgroundStatus',
      window.setAppBackgroundStatus,
      [operationID, data]
    );
  };

  networkStatusChanged = <T>(operationID = uuidv4()) => {
    return this._invoker<T>(
      'networkStatusChanged ',
      window.networkStatusChanged,
      [operationID]
    );
  };

  getLoginUserID = (operationID = uuidv4()) => {
    return this._invoker<string>('getLoginUserID', window.getLoginUserID, [
      operationID,
    ]);
  };

  getSelfUserInfo = (operationID = uuidv4()) => {
    return this._invoker<SelfUserInfo>(
      'getSelfUserInfo',
      window.getSelfUserInfo,
      [operationID]
    );
  };

  getUsersInfo = (data: string[], operationID = uuidv4()) => {
    return this._invoker<FullUserItem[]>('getUsersInfo', window.getUsersInfo, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  getUsersInfoWithCache = (
    data: GetUserInfoWithCacheParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<FullUserItemWithCache[]>(
      'getUsersInfoWithCache',
      window.getUsersInfoWithCache,
      [operationID, JSON.stringify(data.userIDList), data.groupID]
    );
  };

  setSelfInfo = <T>(data: PartialUserItem, operationID = uuidv4()) => {
    return this._invoker<T>('setSelfInfo', window.setSelfInfo, [
      operationID,
      JSON.stringify(data),
    ]);
  };

  createTextAtMessage = (data: AtMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createTextAtMessage',
      window.createTextAtMessage,
      [
        operationID,
        data.text,
        JSON.stringify(data.atUserIDList),
        JSON.stringify(data.atUsersInfo),
        JSON.stringify(data.message) ?? '',
      ],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createSoundMessage = (data: SoundMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createSoundMessage',
      window.createSoundMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };
  createSoundMessageByFile = <T>(
    data: SoundMsgParams & { file: File },
    operationID = uuidv4()
  ) => {
    data.uuid = `${data.uuid}/${data.file.name}`;
    fileMapSet(data.uuid, data.file);
    return this._invoker<T>(
      'createSoundMessageByFile',
      window.createSoundMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createVideoMessage = (data: VideoMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createVideoMessage',
      window.createVideoMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createVideoMessageByFile = <T>(
    data: VideoMsgParams & { videoFile: File; snapshotFile: File },
    operationID = uuidv4()
  ) => {
    data.videoUUID = `${data.videoUUID}/${data.videoFile.name}`;
    data.snapshotUUID = `${data.snapshotUUID}/${data.snapshotFile.name}`;
    fileMapSet(data.videoUUID, data.videoFile);
    fileMapSet(data.snapshotUUID, data.snapshotFile);
    return this._invoker<T>(
      'createVideoMessageByFile',
      window.createVideoMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createFileMessage = (data: FileMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createFileMessage',
      window.createFileMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createFileMessageByFile = <T>(
    data: FileMsgParams & { file: File },
    operationID = uuidv4()
  ) => {
    data.uuid = `${data.uuid}/${data.file.name}`;
    fileMapSet(data.uuid, data.file);
    return this._invoker<T>(
      'createFileMessageByFile',
      window.createFileMessageByURL,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createFileMessageFromFullPath = <T>(
    data: FileMsgFullParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'createFileMessageFromFullPath',
      window.createFileMessageFromFullPath,
      [operationID, data.fileFullPath, data.fileName],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createImageMessageFromFullPath = <T>(
    data: string,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'createImageMessageFromFullPath ',
      window.createImageMessageFromFullPath,
      [operationID, data],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createSoundMessageFromFullPath = <T>(
    data: SouondMsgFullParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'createSoundMessageFromFullPath ',
      window.createSoundMessageFromFullPath,
      [operationID, data.soundPath, data.duration],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createVideoMessageFromFullPath = <T>(
    data: VideoMsgFullParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
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
  };

  createMergerMessage = <T>(data: MergerMsgParams, operationID = uuidv4()) => {
    return this._invoker<T>(
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
  };

  createForwardMessage = (data: MessageItem, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createForwardMessage ',
      window.createForwardMessage,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createFaceMessage = <T>(data: FaceMessageParams, operationID = uuidv4()) => {
    return this._invoker<T>(
      'createFaceMessage ',
      window.createFaceMessage,
      [operationID, data.index, data.data],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createLocationMessage = (data: LocationMsgParams, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createLocationMessage ',
      window.createLocationMessage,
      [operationID, data.description, data.longitude, data.latitude],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  createCardMessage = (data: CardElem, operationID = uuidv4()) => {
    return this._invoker<MessageItem>(
      'createCardMessage ',
      window.createCardMessage,
      [operationID, JSON.stringify(data)],
      data => {
        // compitable with old version sdk
        return data[0];
      }
    );
  };

  deleteMessageFromLocalStorage = <T>(
    data: AccessMessageParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'deleteMessageFromLocalStorage ',
      window.deleteMessageFromLocalStorage,
      [operationID, data.conversationID, data.clientMsgID]
    );
  };

  deleteMessage = <T>(data: AccessMessageParams, operationID = uuidv4()) => {
    return this._invoker<T>('deleteMessage ', window.deleteMessage, [
      operationID,
      data.conversationID,
      data.clientMsgID,
    ]);
  };

  deleteAllConversationFromLocal = <T>(operationID = uuidv4()) => {
    return this._invoker<T>(
      'deleteAllConversationFromLocal ',
      window.deleteAllConversationFromLocal,
      [operationID]
    );
  };

  deleteAllMsgFromLocal = <T>(operationID = uuidv4()) => {
    return this._invoker<T>(
      'deleteAllMsgFromLocal ',
      window.deleteAllMsgFromLocal,
      [operationID]
    );
  };

  deleteAllMsgFromLocalAndSvr = <T>(operationID = uuidv4()) => {
    return this._invoker<T>(
      'deleteAllMsgFromLocalAndSvr ',
      window.deleteAllMsgFromLocalAndSvr,
      [operationID]
    );
  };

  insertSingleMessageToLocalStorage = <T>(
    data: InsertSingleMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'insertSingleMessageToLocalStorage ',
      window.insertSingleMessageToLocalStorage,
      [operationID, JSON.stringify(data.message), data.recvID, data.sendID]
    );
  };

  insertGroupMessageToLocalStorage = <T>(
    data: InsertGroupMsgParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'insertGroupMessageToLocalStorage ',
      window.insertGroupMessageToLocalStorage,
      [operationID, JSON.stringify(data.message), data.groupID, data.sendID]
    );
  };
  typingStatusUpdate = <T>(
    data: TypingUpdateParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('typingStatusUpdate ', window.typingStatusUpdate, [
      operationID,
      data.recvID,
      data.msgTip,
    ]);
  };
  clearConversationAndDeleteAllMsg = <T>(
    data: string,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'clearConversationAndDeleteAllMsg ',
      window.clearConversationAndDeleteAllMsg,
      [operationID, data]
    );
  };
  hideConversation = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('hideConversation ', window.hideConversation, [
      operationID,
      data,
    ]);
  };
  getConversationListSplit = (data: SplitParams, operationID = uuidv4()) => {
    return this._invoker<ConversationItem[]>(
      'getConversationListSplit ',
      window.getConversationListSplit,
      [operationID, data.offset, data.count]
    );
  };
  getConversationIDBySessionType = (
    data: GetOneCveParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<string>(
      'getConversationIDBySessionType ',
      window.getConversationIDBySessionType,
      [operationID, data.sourceID, data.sessionType]
    );
  };

  getMultipleConversation = (data: string[], operationID = uuidv4()) => {
    return this._invoker<ConversationItem[]>(
      'getMultipleConversation ',
      window.getMultipleConversation,
      [operationID, JSON.stringify(data)]
    );
  };

  deleteConversation = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('deleteConversation ', window.deleteConversation, [
      operationID,
      data,
    ]);
  };

  setConversationDraft = <T>(data: SetDraftParams, operationID = uuidv4()) => {
    return this._invoker<T>(
      'setConversationDraft ',
      window.setConversationDraft,
      [operationID, data.conversationID, data.draftText]
    );
  };

  pinConversation = <T>(data: PinCveParams, operationID = uuidv4()) => {
    return this._invoker<T>('pinConversation ', window.pinConversation, [
      operationID,
      data.conversationID,
      data.isPinned,
    ]);
  };
  getTotalUnreadMsgCount = (operationID = uuidv4()) => {
    return this._invoker<number>(
      'getTotalUnreadMsgCount ',
      window.getTotalUnreadMsgCount,
      [operationID]
    );
  };
  getConversationRecvMessageOpt = (data: string[], operationID = uuidv4()) => {
    return this._invoker<ConversationItem[]>(
      'getConversationRecvMessageOpt ',
      window.getConversationRecvMessageOpt,
      [operationID, JSON.stringify(data)]
    );
  };
  setConversationRecvMessageOpt = <T>(
    data: isRecvParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setConversationRecvMessageOpt ',
      window.setConversationRecvMessageOpt,
      [operationID, data.conversationID, data.opt]
    );
  };
  searchLocalMessages = (data: SearchLocalParams, operationID = uuidv4()) => {
    return this._invoker<SearchMessageResult>(
      'searchLocalMessages ',
      window.searchLocalMessages,
      [operationID, JSON.stringify(data)]
    );
  };
  addFriend = <T>(data: AddFriendParams, operationID = uuidv4()) => {
    return this._invoker<T>('addFriend ', window.addFriend, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  searchFriends = (data: SearchFriendParams, operationID = uuidv4()) => {
    return this._invoker<SearchedFriendsInfo[]>(
      'searchFriends ',
      window.searchFriends,
      [operationID, JSON.stringify(data)]
    );
  };
  getSpecifiedFriendsInfo = (data: string[], operationID = uuidv4()) => {
    return this._invoker<FriendUserItem[]>(
      'getSpecifiedFriendsInfo ',
      window.getSpecifiedFriendsInfo,
      [operationID, JSON.stringify(data)]
    );
  };
  getFriendApplicationListAsRecipient = (operationID = uuidv4()) => {
    return this._invoker<FriendApplicationItem[]>(
      'getFriendApplicationListAsRecipient ',
      window.getFriendApplicationListAsRecipient,
      [operationID]
    );
  };
  getFriendApplicationListAsApplicant = (operationID = uuidv4()) => {
    return this._invoker<FriendApplicationItem[]>(
      'getFriendApplicationListAsApplicant ',
      window.getFriendApplicationListAsApplicant,
      [operationID]
    );
  };
  getFriendList = (operationID = uuidv4()) => {
    return this._invoker<FriendUserItem[]>(
      'getFriendList ',
      window.getFriendList,
      [operationID]
    );
  };
  setFriendRemark = <T>(data: RemarkFriendParams, operationID = uuidv4()) => {
    return this._invoker<T>('setFriendRemark ', window.setFriendRemark, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  checkFriend = (data: string[], operationID = uuidv4()) => {
    return this._invoker<FriendshipInfo[]>('checkFriend', window.checkFriend, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  acceptFriendApplication = <T>(
    data: AccessFriendParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'acceptFriendApplication',
      window.acceptFriendApplication,
      [operationID, JSON.stringify(data)]
    );
  };
  refuseFriendApplication = <T>(
    data: AccessFriendParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'refuseFriendApplication ',
      window.refuseFriendApplication,
      [operationID, JSON.stringify(data)]
    );
  };
  deleteFriend = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('deleteFriend ', window.deleteFriend, [
      operationID,
      data,
    ]);
  };
  addBlack = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('addBlack ', window.addBlack, [operationID, data]);
  };
  removeBlack = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('removeBlack ', window.removeBlack, [
      operationID,
      data,
    ]);
  };
  getBlackList = (operationID = uuidv4()) => {
    return this._invoker<BlackUserItem[]>(
      'getBlackList ',
      window.getBlackList,
      [operationID]
    );
  };
  inviteUserToGroup = <T>(data: InviteGroupParams, operationID = uuidv4()) => {
    return this._invoker<T>('inviteUserToGroup ', window.inviteUserToGroup, [
      operationID,
      data.groupID,
      data.reason,
      JSON.stringify(data.userIDList),
    ]);
  };
  kickGroupMember = <T>(data: InviteGroupParams, operationID = uuidv4()) => {
    return this._invoker<T>('kickGroupMember ', window.kickGroupMember, [
      operationID,
      data.groupID,
      data.reason,
      JSON.stringify(data.userIDList),
    ]);
  };
  isJoinGroup = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('isJoinGroup ', window.isJoinGroup, [
      operationID,
      data,
    ]);
  };

  getSpecifiedGroupMembersInfo = (
    data: Omit<InviteGroupParams, 'reason'>,
    operationID = uuidv4()
  ) => {
    return this._invoker<GroupMemberItem[]>(
      'getSpecifiedGroupMembersInfo ',
      window.getSpecifiedGroupMembersInfo,
      [operationID, data.groupID, JSON.stringify(data.userIDList)]
    );
  };
  getGroupMemberListByJoinTimeFilter = (
    data: GetGroupMemberByTimeParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<GroupMemberItem[]>(
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
  };
  searchGroupMembers = (
    data: SearchGroupMemberParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<GroupMemberItem[]>(
      'searchGroupMembers ',
      window.searchGroupMembers,
      [operationID, JSON.stringify(data)]
    );
  };
  setGroupApplyMemberFriend = <T>(
    data: SetMemberAuthParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setGroupApplyMemberFriend ',
      window.setGroupApplyMemberFriend,
      [operationID, data.groupID, data.rule]
    );
  };
  setGroupLookMemberInfo = <T>(
    data: SetMemberAuthParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setGroupLookMemberInfo ',
      window.setGroupLookMemberInfo,
      [operationID, data.groupID, data.rule]
    );
  };
  getJoinedGroupList = (operationID = uuidv4()) => {
    return this._invoker<GroupItem[]>(
      'getJoinedGroupList ',
      window.getJoinedGroupList,
      [operationID]
    );
  };
  createGroup = (data: CreateGroupParams, operationID = uuidv4()) => {
    return this._invoker<GroupItem>('createGroup ', window.createGroup, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  setGroupInfo = <T>(
    data: Partial<GroupItem> & { groupID: string },
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('setGroupInfo ', window.setGroupInfo, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  setGroupMemberNickname = <T>(
    data: MemberNameParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setGroupMemberNickname ',
      window.setGroupMemberNickname,
      [operationID, data.groupID, data.userID, data.groupMemberNickname]
    );
  };
  setGroupMemberInfo = <T>(
    data: UpdateMemberInfoParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('setGroupMemberInfo ', window.setGroupMemberInfo, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  joinGroup = <T>(data: JoinGroupParams, operationID = uuidv4()) => {
    return this._invoker<T>('joinGroup ', window.joinGroup, [
      operationID,
      data.groupID,
      data.reqMsg,
      data.joinSource,
    ]);
  };
  searchGroups = (data: SearchGroupParams, operationID = uuidv4()) => {
    return this._invoker<GroupItem[]>('searchGroups ', window.searchGroups, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  quitGroup = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('quitGroup ', window.quitGroup, [
      operationID,
      data,
    ]);
  };
  dismissGroup = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>('dismissGroup ', window.dismissGroup, [
      operationID,
      data,
    ]);
  };
  changeGroupMute = <T>(
    data: ChangeGroupMuteParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('changeGroupMute ', window.changeGroupMute, [
      operationID,
      data.groupID,
      data.isMute,
    ]);
  };
  changeGroupMemberMute = <T>(
    data: ChangeGroupMemberMuteParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'changeGroupMemberMute ',
      window.changeGroupMemberMute,
      [operationID, data.groupID, data.userID, data.mutedSeconds]
    );
  };
  transferGroupOwner = <T>(
    data: TransferGroupParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('transferGroupOwner ', window.transferGroupOwner, [
      operationID,
      data.groupID,
      data.newOwnerUserID,
    ]);
  };
  getGroupApplicationListAsApplicant = (operationID = uuidv4()) => {
    return this._invoker<GroupApplicationItem[]>(
      'getGroupApplicationListAsApplicant ',
      window.getGroupApplicationListAsApplicant,
      [operationID]
    );
  };
  getGroupApplicationListAsRecipient = (operationID = uuidv4()) => {
    return this._invoker<GroupApplicationItem[]>(
      'getGroupApplicationListAsRecipient ',
      window.getGroupApplicationListAsRecipient,
      [operationID]
    );
  };
  acceptGroupApplication = <T>(
    data: AccessGroupParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'acceptGroupApplication ',
      window.acceptGroupApplication,
      [operationID, data.groupID, data.fromUserID, data.handleMsg]
    );
  };
  refuseGroupApplication = <T>(
    data: AccessGroupParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'refuseGroupApplication ',
      window.refuseGroupApplication,
      [operationID, data.groupID, data.fromUserID, data.handleMsg]
    );
  };
  resetConversationGroupAtType = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>(
      'resetConversationGroupAtType ',
      window.resetConversationGroupAtType,
      [operationID, data]
    );
  };
  setGroupMemberRoleLevel = <T>(
    data: SetGroupRoleParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setGroupMemberRoleLevel ',
      window.setGroupMemberRoleLevel,
      [operationID, data.groupID, data.userID, data.roleLevel]
    );
  };
  setGroupVerification = <T>(
    data: SetGroupVerificationParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setGroupVerification ',
      window.setGroupVerification,
      [operationID, data.groupID, data.verification]
    );
  };
  getGroupMemberOwnerAndAdmin = (data: string, operationID = uuidv4()) => {
    return this._invoker<GroupMemberItem[]>(
      'getGroupMemberOwnerAndAdmin ',
      window.getGroupMemberOwnerAndAdmin,
      [operationID, data]
    );
  };
  setGlobalRecvMessageOpt = <T>(
    opt: MessageReceiveOptType,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setGlobalRecvMessageOpt ',
      window.setGlobalRecvMessageOpt,
      [operationID, opt]
    );
  };
  findMessageList = (data: FindMessageParams[], operationID = uuidv4()) => {
    return this._invoker<SearchMessageResult>(
      'findMessageList ',
      window.findMessageList,
      [operationID, JSON.stringify(data)]
    );
  };
  uploadFile = (data: UploadFileParams, operationID = uuidv4()) => {
    data.uuid = `${data.uuid}/${data.file.name}`;
    fileMapSet(data.uuid, data.file);
    return this._invoker<{ url: string }>('uploadFile ', window.uploadFile, [
      operationID,
      JSON.stringify({
        ...data,
        filepath: '',
        cause: '',
      }),
    ]);
  };
  subscribeUsersStatus = (data: string[], operationID = uuidv4()) => {
    return this._invoker<UserOnlineState[]>(
      'subscribeUsersStatus ',
      window.subscribeUsersStatus,
      [operationID, JSON.stringify(data)]
    );
  };
  unsubscribeUsersStatus = (data: string[], operationID = uuidv4()) => {
    return this._invoker<UserOnlineState[]>(
      'unsubscribeUsersStatus ',
      window.unsubscribeUsersStatus,
      [operationID, JSON.stringify(data)]
    );
  };
  getUserStatus = (operationID = uuidv4()) => {
    return this._invoker<UserOnlineState[]>(
      'getUserStatus ',
      window.getUserStatus,
      [operationID]
    );
  };
  getSubscribeUsersStatus = (operationID = uuidv4()) => {
    return this._invoker<UserOnlineState[]>(
      'getSubscribeUsersStatus ',
      window.getSubscribeUsersStatus,
      [operationID]
    );
  };
  signalingInvite = <T>(
    data: SignalingInviteParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>('signalingInvite ', window.signalingInvite, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  signalingInviteInGroup = <T>(
    data: SignalingInviteParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'signalingInviteInGroup ',
      window.signalingInviteInGroup,
      [operationID, JSON.stringify(data)]
    );
  };
  signalingAccept = <T>(data: RtcActionParams, operationID = uuidv4()) => {
    return this._invoker<T>('signalingAccept ', window.signalingAccept, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  signalingReject = <T>(data: RtcActionParams, operationID = uuidv4()) => {
    return this._invoker<T>('signalingReject ', window.signalingReject, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  signalingCancel = <T>(data: RtcActionParams, operationID = uuidv4()) => {
    return this._invoker<T>('signalingCancel ', window.signalingCancel, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  signalingHungUp = <T>(data: RtcActionParams, operationID = uuidv4()) => {
    return this._invoker<T>('signalingHungUp ', window.signalingHungUp, [
      operationID,
      JSON.stringify(data),
    ]);
  };
  signalingGetRoomByGroupID = <T>(groupID: string, operationID = uuidv4()) => {
    return this._invoker<T>(
      'signalingGetRoomByGroupID ',
      window.signalingGetRoomByGroupID,
      [operationID, groupID]
    );
  };
  signalingGetTokenByRoomID = <T>(roomID: string, operationID = uuidv4()) => {
    return this._invoker<T>(
      'signalingGetTokenByRoomID ',
      window.signalingGetTokenByRoomID,
      [operationID, roomID]
    );
  };
  signalingSendCustomSignal = <T>(
    data: CustomSignalParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'signalingSendCustomSignal ',
      window.signalingSendCustomSignal,
      [operationID, data.customInfo, data.roomID]
    );
  };
  signalingCreateMeeting = <T>(
    data: CreateMeetingParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'signalingCreateMeeting ',
      window.signalingCreateMeeting,
      [operationID, JSON.stringify(data)]
    );
  };
  signalingJoinMeeting = <T>(data: string, operationID = uuidv4()) => {
    return this._invoker<T>(
      'signalingJoinMeeting ',
      window.signalingJoinMeeting,
      [
        operationID,
        JSON.stringify({
          roomID: data,
        }),
      ]
    );
  };
  signalingUpdateMeetingInfo = <T>(
    data: UpdateMeetingParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'signalingUpdateMeetingInfo ',
      window.signalingUpdateMeetingInfo,
      [operationID, JSON.stringify(data)]
    );
  };
  signalingCloseRoom = <T>(roomID: string, operationID = uuidv4()) => {
    return this._invoker<T>('signalingCloseRoom ', window.signalingCloseRoom, [
      operationID,
      roomID,
    ]);
  };
  signalingGetMeetings = <T>(operationID = uuidv4()) => {
    return this._invoker<T>(
      'signalingGetMeetings ',
      window.signalingGetMeetings,
      [operationID]
    );
  };
  signalingOperateStream = <T>(
    data: MeetingOperateStreamParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'signalingOperateStream ',
      window.signalingOperateStream,
      [
        operationID,
        data.streamType,
        data.roomID,
        data.userID,
        data.mute,
        data.muteAll,
      ]
    );
  };
  setConversationIsMsgDestruct = <T>(
    data: SetConversationMsgDestructParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setConversationIsMsgDestruct ',
      window.setConversationIsMsgDestruct,
      [operationID, data.conversationID, data.isMsgDestruct]
    );
  };
  setConversationMsgDestructTime = <T>(
    data: SetConversationMsgDestructTimeParams,
    operationID = uuidv4()
  ) => {
    return this._invoker<T>(
      'setConversationMsgDestructTime ',
      window.setConversationMsgDestructTime,
      [operationID, data.conversationID, data.msgDestructTime]
    );
  };
  fileMapSet = (uuid: string, file: File) => fileMapSet(uuid, file);
}

let instance: SDK;

export function getSDK(url = '/openIM.wasm'): SDK {
  if (typeof window === 'undefined') {
    return {} as SDK;
  }

  if (instance) {
    return instance;
  }

  instance = new SDK(url);

  return instance;
}
