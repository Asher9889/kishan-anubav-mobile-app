import { Images } from "@/assets";
import { Image } from "expo-image";

export default function Logo({ width = 100, height = 100 }: { width?: number; height?: number }) {
  return (
    <Image
      source={Images.logo}
      style={{ width, height }}
    />
  );
}