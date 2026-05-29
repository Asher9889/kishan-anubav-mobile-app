import AuthPhoneScreen from "../auth/components/AuthPhoneScreen";
import useSendOtp from "../auth/hooks/useSendOtp.ts";

const LoginScreen = () => {
    const { mutate} = useSendOtp();
    
    const handleContinue = (phoneNumber: string) => {
        mutate({ phone: phoneNumber });
    }

    return (
        // <View style={{ flex: 1, marginTop: insets.top, marginBottom: insets.bottom, backgroundColor: "red" }}>

            <AuthPhoneScreen onContinue={handleContinue} />
        // </View>
    );
  
}

export default LoginScreen;