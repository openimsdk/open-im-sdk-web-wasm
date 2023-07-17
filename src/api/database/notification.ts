import { DatabaseErrorCode } from '@/constant';
import {
  setNotificationSeq as databaseSetNotificationSeq,
  getNotificationAllSeqs as databaseGetNotificationAllSeqs,
} from '@/sqls';
import { formatResponse } from '@/utils';
import { getInstance } from './instance';

export async function setNotificationSeq(
  conversationID: string,
  seq: number
): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseSetNotificationSeq(db, conversationID, seq);

    return formatResponse(execResult[0]);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}

export async function getNotificationAllSeqs(): Promise<string> {
  try {
    const db = await getInstance();
    const execResult = databaseGetNotificationAllSeqs(db);

    return formatResponse(execResult[0] ?? []);
  } catch (e) {
    console.error(e);

    return formatResponse(
      undefined,
      DatabaseErrorCode.ErrorInit,
      JSON.stringify(e)
    );
  }
}
