import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-8 bg-background px-8">
      <Text className="text-h1 color-lingua-purple font-poppins-bold">Lingua</Text>
      <Link
        className="rounded-button bg-lingua-purple px-8 py-4 text-center font-poppins-semibold text-body-large text-white"
        href="/onboarding"
      >
        Open onboarding
      </Link>
    </View>
  );
}
