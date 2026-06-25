import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from "expo-sqlite";
import * as allSchema from './models';

export const sqlite = SQLite.openDatabaseSync('krishi-anubhav-db.db');
const db = drizzle(sqlite, { schema: allSchema });



export default db;