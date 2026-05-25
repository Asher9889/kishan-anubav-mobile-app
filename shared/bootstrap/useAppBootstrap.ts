import migrations from '@/drizzle/migrations';
import db from '@/shared/db/sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

const useAppBootstrap = () => {
    const { success, error } = useMigrations(db, migrations);

    if (error) {
        console.error("Database migration failed:", error);
    } else if (success) {
        console.log("Database migrated successfully");
    }

   
    // (async () => {
    //     const chats = (await db.query.chats.findMany({})).length;

    //     console.log("chats are", chats);
    // })()
    return { db, migrationSuccess: success, migrationError: error };
}


export default useAppBootstrap;