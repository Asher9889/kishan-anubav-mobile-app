import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from "expo-sqlite";


const sqlite = SQLite.openDatabaseSync('krishi-anubhav.db');
const db = drizzle(sqlite);