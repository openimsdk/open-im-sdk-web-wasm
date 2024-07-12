import { Database } from '@jlongster/sql.js';

export function alterTable(db: Database) {
  alter351(db);
  alter380(db);
}

function alter351(db: Database) {
  try {
    db.exec(
      `
        ALTER TABLE local_friends ADD COLUMN is_pinned numeric;
        `
    );
  } catch (error) {
    // alter table error
  }
}

function alter380(db: Database) {
  try {
    db.exec(
      `
        ALTER TABLE local_groups ADD COLUMN display_is_read numeric;
        `
    );
  } catch (error) {
    // alter table error
  }
}
