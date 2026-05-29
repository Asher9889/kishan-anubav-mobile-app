import { useAuthStore } from "@/features/auth/store/auth.store";
import { Redirect, Slot } from "expo-router";

export default function PublicLayout() {

    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    if (isAuthenticated) {
        return (
            <Redirect
                href="/(public)"
            />
        );
    }
    return (
        <>
            <Slot />
        </>
    )

}