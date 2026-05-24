import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from "expo-sqlite";


export const sqlite = SQLite.openDatabaseSync('krishi-anubhav-db.db');
const db = drizzle(sqlite);

export default db;