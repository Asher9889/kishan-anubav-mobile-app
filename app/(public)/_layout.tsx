import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function PublicLayout({isAuthenticated}: { isAuthenticated: boolean }) {

    return (
        <>
            <StatusBar />
            <Stack>
                <Stack.Screen name="login"  options={{ headerShown: false }} />
                <Stack.Screen name="verify-otp"  options={{ headerShown: false }} />
            </Stack>
        </>
    )

}