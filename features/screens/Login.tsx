import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthPhoneScreen from "../auth/components/AuthPhoneScreen";
import useSendOtp from "../auth/hooks/useSendOtp.ts";

const LoginScreen = () => {
    const mutation = useSendOtp();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? Colors.dark : Colors.light;

    const handleContinue = (phoneNumber: string) => {
        mutation.mutate({ phone: phoneNumber });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <AuthPhoneScreen isPending={mutation.isPending} onContinue={handleContinue} />
        </SafeAreaView>

    )

}

export default LoginScreen;