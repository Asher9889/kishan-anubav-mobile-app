import migrations from '@/drizzle/migrations';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { soundService } from '@/services';
import db from '@/shared/db/sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { endPoints } from '../api';
import { nodeApi } from '../api/axios';

const useAppBootstrap = () => {
    const { success, error } = useMigrations(db, migrations); // db
    const { setBootstrapping, logout, login } = useAuthStore();

    useEffect(() => {
        if(!success)  return;

        const bootstrap = async () => {
            try {
            // 1. boot strapping true
            setBootstrapping(true);
            await soundService.load();
            //2. getting refresh Token
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            // 3. if not exits call logout
            if (!refreshToken) {
                logout();
                return 
            }
            //4. if exits and correct. get new pair of tokens.
            const { url, method } = endPoints.AUTH.REFRESH_TOKEN
                const response = await nodeApi.request<{ tokens: { accessToken: string; refreshToken: string }, user: {id: string, phone: string} }>({
                    url,
                    method,
                    data: { refreshToken },
                })
                const data = response.data as { tokens: { accessToken: string; refreshToken: string }, user: {id: string, phone: string} };
                const user = data.user;
                const token = data.tokens
                const newAccessToken = token?.accessToken;
                const newRefreshToken = token?.refreshToken;
                console.log("[BOOTSTRAP]Token refresh response:", Object.keys(data));
                //5. setting user and accesToken to Zustand


                console.log("[BOOTSTRAP]User data:", user);
                console.log("[BOOTSTRAP]New Access Token:", newAccessToken);
                console.log("[BOOTSTRAP]New Refresh Token:", newRefreshToken);
                login({user, accessToken: newAccessToken,});
                // 6. setting new refresh token to secure store
                await SecureStore.setItemAsync("refreshToken", newRefreshToken);
            } catch (error) {
                // console.error("Error refreshing token:", error);
                await SecureStore.deleteItemAsync("refreshToken");
                return logout();
            } finally {
                setBootstrapping(false);
            }

        };

        bootstrap();
    }, [success]);




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