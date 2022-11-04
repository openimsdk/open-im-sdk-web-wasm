import { RequestFunc } from '../constant';
import { GroupType } from './enum';

// api

type WsResponse = {
  event: RequestFunc;
  errCode: number;
  errMsg: string;
  data: any;
  operationID: string;
};

type IMConfig = {
  platform: number;
  api_addr: string;
  ws_addr: string;
  log_level: number;
};

type OfflinePush = {
  title: string;
  desc: string;
  ex: string;
  iOSPushSound: string;
  iOSBadgeCount: boolean;
};

type MessageEntity = {
  type: string;
  offset: number;
  length: number;
  url?: string;
  info?: string;
};

type PicBaseInfo = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};

type AtUsersInfoItem = {
  atUserID: string;
  groupNickname: string;
};

type GroupInitInfo = {
  groupType: GroupType;
  groupName: string;
  introduction?: string;
  notification?: string;
  faceURL?: string;
  ex?: string;
};

type CreateMember = {
  userID: string;
  roleLevel: number;
};

type RtcInvite = {
  inviterUserID: string;
  inviteeUserIDList: string[];
  groupID: string;
  roomID: string;
  timeout: number;
  mediaType: string;
  sessionType: number;
  platformID: number;
};
