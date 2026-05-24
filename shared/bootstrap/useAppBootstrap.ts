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

//     (async () => {
//         const tables = await sqlite.getAllAsync(`
//   SELECT name FROM sqlite_master WHERE type='table';
// `);

//         console.log(tables);
//     })()
    return { db, migrationSuccess: success, migrationError: error };
}


export default useAppBootstrap;