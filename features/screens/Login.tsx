import AuthPhoneScreen from "../auth/components/AuthPhoneScreen";
import useSendOtp from "../auth/hooks/useSendOtp.ts";

const LoginScreen = () => {
    const mutation = useSendOtp();
    
    const handleContinue = (phoneNumber: string) => {
        mutation.mutate({ phone: phoneNumber });
    }

    return (
        // <View style={{ flex: 1, marginTop: insets.top, marginBottom: insets.bottom, backgroundColor: "red" }}>

            <AuthPhoneScreen isPending={mutation.isPending} onContinue={handleContinue} />
        // </View>
    );
  
}

export default LoginScreen;