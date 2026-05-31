import { images } from "@/constants/images";
import { Link } from "expo-router";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const { height, width } = useWindowDimensions();
  const mascotSize = Math.min(330, width * 0.84, height * 0.38);
  const mascotTopOffset = height < 760 ? 6 : 18;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 bg-background px-9 pb-8 pt-5">
        <View className="items-center">
          <View className="flex-row items-center justify-center gap-3">
            <Image className="h-[54px] w-[54px]" resizeMode="contain" source={images.mascotLogo} />
            <Text className="font-poppins-bold text-[38px] leading-[46px] text-text-primary">lingua</Text>
          </View>
        </View>

        <View className="mt-16">
          <Text className="font-poppins-bold text-[36px] leading-[48px] text-text-primary">Your AI language</Text>
          <Text className="font-poppins-bold text-[36px] leading-[48px] text-lingua-deep-purple">teacher.</Text>
          <Text className="mt-5 font-poppins-regular text-[18px] leading-[32px] text-[#697086]">Real conversations, personalized{"\n"}lessons, anytime, anywhere.</Text>
        </View>

        <View className="relative mt-6 flex-1 items-center">
          <View className="absolute left-0 top-2 rounded-[18px] bg-[#eef7ff] px-6 py-4">
            <Text className="font-poppins-medium text-[22px] leading-[28px] text-text-primary">Hello!</Text>
            <View className="absolute -bottom-2 right-6 h-5 w-5 bg-[#eef7ff]" style={{ transform: [{ rotate: "45deg" }] }} />
          </View>

          <View className="absolute right-1 top-0 rounded-[18px] bg-[#f5f4ff] px-6 py-4">
            <Text className="font-poppins-medium text-[22px] italic leading-[28px] text-lingua-deep-purple">{"\u00a1Hola!"}</Text>
            <View className="absolute -bottom-2 left-7 h-5 w-5 bg-[#f5f4ff]" style={{ transform: [{ rotate: "45deg" }] }} />
          </View>

          <View className="absolute right-[-8px] top-[190px] rounded-[18px] bg-[#fff4ee] px-6 py-4">
            <Text className="font-poppins-medium text-[22px] leading-[28px] text-[#ff4438]">{"\u4f60\u597d!"}</Text>
            <View className="absolute -bottom-2 left-7 h-5 w-5 bg-[#fff4ee]" style={{ transform: [{ rotate: "45deg" }] }} />
          </View>

          <Image
            resizeMode="contain"
            source={images.mascotWelcome}
            style={{
              height: mascotSize,
              marginTop: mascotTopOffset,
              width: mascotSize,
            }}
          />
        </View>

        <Link href="/" asChild>
          <Pressable className="h-[72px] flex-row items-center justify-center rounded-[22px] bg-lingua-deep-purple px-8">
            <Text className="font-poppins-semibold text-[20px] leading-[28px] text-white">Get Started</Text>
            <Text className="absolute right-8 font-poppins-regular text-[46px] leading-[46px] text-white">{"\u203a"}</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
