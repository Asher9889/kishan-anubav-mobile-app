import { useAuthStore } from "@/features/auth/store/auth.store";
import { Redirect, Slot } from "expo-router";

export default function PrivateLayout() {
  console.log('PrivateLayout mounted');
  const isAuthenticated =useAuthStore(s => s.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Redirect
        href="/login"
      />
    );
  }

  return <Slot />;
}