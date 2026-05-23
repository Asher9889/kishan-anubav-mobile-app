import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";


const c = Colors.light;

interface Props {
    size?: number;
    width?: number;
    height?: number;
    borderRadius?: number;
}

export default function AILogo({
    size = 18,
    width = 36,
    height = 36,
    borderRadius = 18,
}: Props) {
    return (
        <LinearGradient
            colors={[c.primary, "#14B8A6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                width,
                height,
                borderRadius,

                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Sparkles
                size={size}
                color="#FFFFFF"
            />
        </LinearGradient>
    );
}