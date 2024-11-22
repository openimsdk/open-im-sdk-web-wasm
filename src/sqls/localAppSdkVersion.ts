import squel from 'squel';
import { Database, QueryExecResult } from '@jlongster/sql.js';

export type LocalAppSDKVersion = { [key: string]: any };

export function localAppSDKVersions(db: Database): QueryExecResult[] {
  return db.exec(
    `
      create table if not exists 'local_app_sdk_version' (
        'version'         varchar(255),
        'installed'       numeric,
        primary key  ('version')
    ) 
      `
  );
}

export function getAppSDKVersion(db: Database): QueryExecResult[] {
  return db.exec(
    `
      SELECT * FROM local_app_sdk_version LIMIT 1
        `
  );
}

export function insertAppSDKVersion(
  db: Database,
  localAppSDKVersion: LocalAppSDKVersion
): QueryExecResult[] {
  const sql = squel
    .insert()
    .into('local_app_sdk_version')
    .setFields(localAppSDKVersion)
    .toString();

  return db.exec(sql);
}

export function updateAppSDKVersion(
  db: Database,
  oldVersion: string,
  localAppSDKVersion: LocalAppSDKVersion
): QueryExecResult[] {
  const sql = squel
    .update()
    .table('local_app_sdk_version')
    .setFields(localAppSDKVersion)
    .where(`version = '${oldVersion}'`)
    .toString();

  return db.exec(sql);
}
