import migrations from '@/drizzle/migrations';
import { useAuthStore } from '@/features/auth/store/auth.store';
import db from '@/shared/db/sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const useAppBootstrap = () => {
    const { success, error } = useMigrations(db, migrations); // db
    const { setBootstrapping, logout } = useAuthStore();

    useEffect(() => {
        const bootstrap = async () => {
            setBootstrapping(true);
            const refreshToken = await SecureStore.getItemAsync("refreshToken");

            if (!refreshToken) {
                logout();
            }

            setBootstrapping(false);
        };

        bootstrap();
    }, []);




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