import { images } from "@/constants/images";
import { Image as ExpoImage } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthMode = "sign-up" | "sign-in";

type AuthScreenProps = {
  mode: AuthMode;
};

type AuthCopy = {
  title: string;
  subtitle: string;
  primaryAction: string;
  footerText: string;
  footerAction: string;
  footerHref: "/sign-in" | "/sign-up";
};

const authCopy: Record<AuthMode, AuthCopy> = {
  "sign-up": {
    title: "Create your account",
    subtitle: "Start your language journey today ✨",
    primaryAction: "Sign Up",
    footerText: "Already have an account?",
    footerAction: "Log in",
    footerHref: "/sign-in",
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Continue your language journey ✨",
    primaryAction: "Sign In",
    footerText: "Don't have an account?",
    footerAction: "Sign up",
    footerHref: "/sign-up",
  },
};

const socials = [
  { id: "google", label: "Continue with Google" },
  { id: "facebook", label: "Continue with Facebook" },
  { id: "apple", label: "Continue with Apple" },
] as const;

const socialIconSources: Record<(typeof socials)[number]["id"], string> = {
  apple: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzA3MTQyYiIgZD0iTTMzLjUgMjUuN2MwLTQuNiAzLjgtNi44IDQtNi45LTIuMi0zLjItNS41LTMuNi02LjctMy43LTIuOC0uMy01LjUgMS43LTYuOSAxLjctMS40IDAtMy43LTEuNy02LTEuNi0zLjEgMC02LjIgMS44LTcuOCA0LjYtMy4zIDUuNy0uOCAxNCAyLjMgMTguNyAxLjYgMi4zIDMuNCA0LjggNS44IDQuNyAyLjMtLjEgMy4yLTEuNSA2LTEuNXMzLjYgMS41IDYgMS40YzIuNSAwIDQuMS0yLjMgNS42LTQuNiAxLjgtMi43IDIuNi01LjMgMi42LTUuNC0uMSAwLTQuOC0xLjgtNC45LTcuNHoiLz48cGF0aCBmaWxsPSIjMDcxNDJiIiBkPSJNMjguOSA5LjZjMS4zLTEuNSAyLjEtMy42IDEuOS01LjctMS44LjEtNCAxLjItNS4zIDIuNy0xLjIgMS40LTIuMiAzLjUtMS45IDUuNiAxLjkuMSA0LTEgNS4zLTIuNnoiLz48L3N2Zz4=",
  facebook: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjAiIGZpbGw9IiMxODc3RjIiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjYuNyAyNS41aDQuNmwuNy01LjRoLTUuM3YtMy41YzAtMS42LjQtMi42IDIuNy0yLjZoMi44VjkuMmMtLjUtLjEtMi4yLS4yLTQuMS0uMi00LjEgMC02LjkgMi41LTYuOSA3LjF2NGgtNC42djUuNGg0LjZWMzloNS41VjI1LjV6Ii8+PC9zdmc+",
  google:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGQzEwNyIgZD0iTTQzLjYxMSAyMC4wODNINDJWMjBIMjR2OGgxMS4zMDNjLTEuNjQ5IDQuNjU3LTYuMDggOC0xMS4zMDMgOC02LjYyNyAwLTEyLTUuMzczLTEyLTEyczUuMzczLTEyIDEyLTEyYzMuMDU5IDAgNS44NDIgMS4xNTQgNy45NjEgMy4wMzlsNS42NTctNS42NTdDMzQuMDQ2IDYuMDUzIDI5LjI2OCA0IDI0IDQgMTIuOTU1IDQgNCAxMi45NTUgNCAyNHM4Ljk1NSAyMCAyMCAyMCAyMC04Ljk1NSAyMC0yMGMwLTEuMzQxLS4xMzgtMi42NS0uMzg5LTMuOTE3eiIvPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiAxNC42OTFsNi41NzEgNC44MTlDMTQuNjU1IDE1LjEwOCAxOC45NjEgMTIgMjQgMTJjMy4wNTkgMCA1Ljg0MiAxLjE1NCA3Ljk2MSAzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYgNi4wNTMgMjkuMjY4IDQgMjQgNGMtNy42ODIgMC0xNC4zNDQgNC4zMzctMTcuNjk0IDEwLjY5MXoiLz48cGF0aCBmaWxsPSIjNENBRjUwIiBkPSJNMjQgNDRjNS4xNjYgMCA5Ljg2LTEuOTc3IDEzLjQwOS01LjE5MmwtNi4xOS01LjIzOEMyOS4yMTEgMzUuMDkxIDI2LjcxNSAzNiAyNCAzNmMtNS4yMDIgMC05LjYxOS0zLjMxNy0xMS4yODMtNy45NDZsLTYuNTIyIDUuMDI1QzkuNTA1IDM5LjU1NiAxNi4yMjcgNDQgMjQgNDR6Ii8+PHBhdGggZmlsbD0iIzE5NzZEMiIgZD0iTTQzLjYxMSAyMC4wODNINDJWMjBIMjR2OGgxMS4zMDNjLS43OTIgMi4yMzctMi4yMzEgNC4xNjYtNC4wODcgNS41NzFsNi4xOSA1LjIzOEMzNi45NjggMzkuMjA1IDQ0IDM0IDQ0IDI0YzAtMS4zNDEtLjEzOC0yLjY1LS4zODktMy45MTd6Ii8+PC9zdmc+",
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const copy = authCopy[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);

  const contentMinHeight = Math.max(height, 760);
  const mascotSize = Math.min(238, width * 0.5);

  const handleVerified = () => {
    setIsVerificationVisible(false);
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          minHeight: contentMinHeight,
          paddingBottom: 36,
          paddingHorizontal: 34,
          paddingTop: 25,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable accessibilityLabel="Go back" className="h-12 w-12 justify-center" onPress={() => router.back()}>
          <Text className="font-poppins-regular text-[42px] leading-[42px] text-text-primary">‹</Text>
        </Pressable>

        <View className="mt-6">
          <Text adjustsFontSizeToFit className="font-poppins-bold text-[28px] leading-[36px] text-text-primary" minimumFontScale={0.9} numberOfLines={1}>
            {copy.title}
          </Text>
          <Text className="mt-4 font-poppins-regular text-[19px] leading-[28px] text-[#707894]">{copy.subtitle}</Text>
        </View>

        <View className="relative mt-2 h-[204px] items-center overflow-visible">
          <Sparkle className="absolute left-[94px] top-[67px] text-[#ff9400]" size={26} />
          <Sparkle className="absolute right-[62px] top-[79px] text-[#5b9bff]" size={22} />
          <Sparkle className="absolute right-[76px] top-[121px] text-[#ffd34d]" size={27} />
          <Image
            resizeMode="contain"
            source={images.mascotAuth}
            style={{
              height: mascotSize,
              marginTop: 18,
              width: mascotSize,
            }}
          />
        </View>

        <View className="-mt-8 gap-4">
          <AuthInput label="Email" onChangeText={setEmail} value={email} />
          {mode === "sign-up" ? <AuthInput isPassword label="Password" onChangeText={setPassword} value={password} /> : null}
        </View>

        <Pressable accessibilityRole="button" className="mt-6 h-[76px] items-center justify-center rounded-[17px] bg-lingua-deep-purple" onPress={() => setIsVerificationVisible(true)}>
          <Text className="font-poppins-semibold text-[23px] leading-[30px] text-white">{copy.primaryAction}</Text>
        </Pressable>

        <View className="my-8 flex-row items-center gap-6">
          <View className="h-px flex-1 bg-border" />
          <Text className="font-poppins-regular text-[17px] leading-[24px] text-[#707894]">or continue with</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="gap-4">
          {socials.map((social) => (
            <SocialButton key={social.id} icon={social.id} label={social.label} />
          ))}
        </View>

        <View className="mt-auto flex-row items-center justify-center gap-1 pt-16">
          <Text className="font-poppins-regular text-[18px] leading-[26px] text-[#707894]">{copy.footerText}</Text>
          <Link href={copy.footerHref} asChild>
            <Pressable>
              <Text className="font-poppins-semibold text-[18px] leading-[26px] text-lingua-deep-purple">{copy.footerAction}</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>

      <VerificationModal email={email} isVisible={isVerificationVisible} onClose={() => setIsVerificationVisible(false)} onVerified={handleVerified} />
    </SafeAreaView>
  );
}

type AuthInputProps = {
  isPassword?: boolean;
  label: string;
  onChangeText: (value: string) => void;
  value: string;
};

function AuthInput({ isPassword = false, label, onChangeText, value }: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="h-[88px] justify-center rounded-[18px] border border-border bg-white px-5">
      <Text className="font-poppins-medium text-[15px] leading-[21px] text-[#707894]">{label}</Text>
      <View className="mt-2 flex-row items-center">
        <TextInput autoCapitalize="none" autoCorrect={false} keyboardType={isPassword ? "default" : "email-address"} onChangeText={onChangeText} placeholder={isPassword ? "Password" : "Email"} placeholderTextColor="#707894" secureTextEntry={isPassword && !isPasswordVisible} style={styles.textInput} textContentType={isPassword ? "password" : "emailAddress"} value={value} />
        {isPassword ? (
          <Pressable accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"} accessibilityRole="button" className="h-10 w-10 items-center justify-center" onPress={() => setIsPasswordVisible((current) => !current)}>
            <EyeIcon isVisible={isPasswordVisible} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

type SocialButtonProps = {
  icon: (typeof socials)[number]["id"];
  label: string;
};

function SocialButton({ icon, label }: SocialButtonProps) {
  return (
    <Pressable accessibilityRole="button" className="h-[72px] items-center justify-center rounded-[18px] border border-border bg-white">
      <View className="w-[260px] flex-row items-center">
        <View className="w-9 items-center">{renderSocialIcon(icon)}</View>
        <Text adjustsFontSizeToFit className="ml-5 flex-1 font-poppins-medium text-[16px] leading-[24px] text-text-primary" minimumFontScale={0.9} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function renderSocialIcon(icon: SocialButtonProps["icon"]) {
  return <ExpoImage contentFit="contain" source={{ uri: socialIconSources[icon] }} style={icon === "apple" ? styles.appleIcon : styles.socialIcon} />;
}

type EyeIconProps = {
  isVisible: boolean;
};

function EyeIcon({ isVisible }: EyeIconProps) {
  return (
    <View className="h-[20px] w-[32px] items-center justify-center rounded-full border-[2px] border-[#707894]">
      <View className={`${isVisible ? "h-[10px] w-[10px] bg-lingua-deep-purple" : "h-[8px] w-[8px] bg-[#707894]"} rounded-full`} />
    </View>
  );
}

type SparkleProps = {
  className: string;
  size: number;
};

function Sparkle({ className, size }: SparkleProps) {
  return (
    <Text className={`font-poppins-bold leading-[30px] ${className}`} style={{ fontSize: size }}>
      ✦
    </Text>
  );
}

type VerificationModalProps = {
  email: string;
  isVisible: boolean;
  onClose: () => void;
  onVerified: () => void;
};

function VerificationModal({ email, isVisible, onClose, onVerified }: VerificationModalProps) {
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setCode("");
      return;
    }

    const timeoutId = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  const handleCodeChange = (value: string) => {
    const nextCode = value.replace(/\D/g, "").slice(0, 6);
    setCode(nextCode);

    if (nextCode.length === 6) {
      setTimeout(onVerified, 150);
    }
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={isVisible}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalKeyboardView}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View className="mx-5 rounded-[28px] bg-white px-6 pb-8 pt-7">
          <Text className="text-center font-poppins-bold text-[25px] leading-[32px] text-text-primary">Check your email</Text>
          <Text className="mt-3 text-center font-poppins-regular text-[15px] leading-[24px] text-[#707894]">We sent a verification code to {email}. Enter it below to continue.</Text>

          <Pressable className="mt-7 flex-row justify-center gap-2" onPress={() => inputRef.current?.focus()}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View className={`h-[54px] w-[44px] items-center justify-center rounded-[14px] border ${code.length === index ? "border-lingua-deep-purple" : "border-border"} bg-white`} key={index}>
                <Text className="font-poppins-semibold text-[22px] leading-[28px] text-text-primary">{code[index] ?? ""}</Text>
              </View>
            ))}
          </Pressable>

          <TextInput caretHidden keyboardType="number-pad" maxLength={6} onChangeText={handleCodeChange} ref={inputRef} style={styles.hiddenCodeInput} textContentType="oneTimeCode" value={code} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hiddenCodeInput: {
    height: 1,
    opacity: 0,
    position: "absolute",
    width: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 19, 43, 0.38)",
  },
  modalKeyboardView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 22,
  },
  textInput: {
    color: "#0d132b",
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    lineHeight: 26,
    padding: 0,
  },
  appleIcon: {
    height: 31,
    width: 31,
  },
  socialIcon: {
    height: 32,
    width: 32,
  },
});
