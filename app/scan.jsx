import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/app-state";

export default function Scan() {
  const { addIngredients } = useAppState();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const capture = async () => {
    if (!cameraRef.current || scanning) return;
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.6,
        exif: false,
      });
      const found = await analyzeImage(photo?.base64);
      setFoundCount(found.length);
      await addIngredients(found);
    } catch (error) {
      Alert.alert(
        "Analysen misslyckades",
        error.message ||
          "Försök igen. Kontrollera att bilden inte är för stor.",
      );
      setScanning(false);
      return;
    }
    setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, 1200);
  };

  async function analyzeImage(base64Image) {
    const sanitizedBase64 = (base64Image || "")
      .replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "")
      .trim();

    if (!sanitizedBase64) {
      throw new Error("Det finns ingen bild att analysera.");
    }

    const approximateBytes = Math.ceil((sanitizedBase64.length * 3) / 4);
    if (approximateBytes > 1_600_000) {
      throw new Error(
        "Bilden är för stor. Ta ett nytt foto med bättre ljus och lite längre avstånd.",
      );
    }

    const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(
      /\/$/,
      "",
    );

    const expoDebuggerHost =
      Constants.expoConfig?.hostUri ||
      Constants.expoGoConfig?.hostUri ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost ||
      "localhost";
    const expoHost = expoDebuggerHost.split(":")[0];

    const fallbackApiUrl =
      Platform.OS === "web"
        ? "http://localhost:8787"
        : `http://${expoHost}:8787`;

    const apiUrl =
      configuredApiUrl && !configuredApiUrl.includes("localhost")
        ? configuredApiUrl
        : fallbackApiUrl;

    const isHostedApi = /(vercel\.app|render\.com|railway\.app)/.test(apiUrl);
    const endpoint = isHostedApi
      ? `${apiUrl.replace(/\/$/, "")}/api/analyze-fridge`
      : `${apiUrl.replace(/\/$/, "")}/analyze-fridge`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image: sanitizedBase64 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error ||
          `Backend kunde inte analysera bilden (${response.status}).`,
      );
    }
    const result = await response.json();
    return Array.isArray(result.ingredients)
      ? result.ingredients.filter((item) => item.name && item.quantity)
      : [];
  }
  if (!permission)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#F66A9B" />
      </View>
    );
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={44} color="#F66A9B" />
        <Text style={styles.permissionTitle}>Kameran behövs</Text>
        <Text style={styles.permissionText}>
          Ge appen tillgång för att kunna läsa av hela kylskåpet.
        </Text>
        <Pressable style={styles.pinkButton} onPress={requestPermission}>
          <Text style={styles.pinkButtonText}>Ge tillåtelse</Text>
        </Pressable>
      </View>
    );
  return (
    <View style={styles.cameraPage}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.top}>
          <Pressable style={styles.close} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#FFF9FC" />
          </Pressable>
          <Text style={styles.scanTitle}>Skanna kylskåpet</Text>
          <View style={styles.close} />
        </View>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
        <View style={styles.bottom}>
          {done ? (
            <View style={styles.result}>
              <Ionicons name="checkmark-circle" size={23} color="#8FD3A7" />
              <View>
                <Text style={styles.resultTitle}>Kylskåpet är analyserat</Text>
                <Text style={styles.resultText}>
                  {foundCount} ingredienser hittades
                </Text>
              </View>
              <Pressable onPress={() => router.replace("/")}>
                <Ionicons
                  name="arrow-forward-circle"
                  size={28}
                  color="#F66A9B"
                />
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.instruction}>
                {scanning
                  ? "Läser av dina ingredienser..."
                  : "Placera hela kylskåpet i rutan"}
              </Text>
              <Pressable style={styles.shutter} onPress={capture}>
                {scanning ? (
                  <ActivityIndicator color="#171419" />
                ) : (
                  <View style={styles.shutterInner} />
                )}
              </Pressable>
              <Text style={styles.smallInstruction}>
                Vi identifierar namn och mängd automatiskt
              </Text>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  cameraPage: { flex: 1, backgroundColor: "#171419" },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(10,7,10,0.22)",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  close: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(16,14,17,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanTitle: { color: "#FFF9FC", fontWeight: "900", fontSize: 16 },
  frame: {
    alignSelf: "center",
    width: "82%",
    aspectRatio: 0.78,
    position: "relative",
  },
  corner: {
    width: 32,
    height: 32,
    borderColor: "#F66A9B",
    position: "absolute",
  },
  tl: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3 },
  tr: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3 },
  bl: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3 },
  br: { bottom: 0, right: 0, borderRightWidth: 3, borderBottomWidth: 3 },
  bottom: {
    backgroundColor: "rgba(16,14,17,0.88)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: "center",
    padding: 22,
    minHeight: 190,
  },
  instruction: {
    color: "#FFF9FC",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 16,
  },
  shutter: {
    width: 73,
    height: 73,
    borderRadius: 37,
    backgroundColor: "#FFF9FC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#F66A9B",
  },
  shutterInner: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#F66A9B",
  },
  smallInstruction: { color: "#8D8792", fontSize: 11, marginTop: 15 },
  result: {
    width: "100%",
    backgroundColor: "#1A171C",
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  resultTitle: { color: "#FFF9FC", fontSize: 13, fontWeight: "900" },
  resultText: { color: "#8D8792", fontSize: 11, marginTop: 4 },
  center: {
    flex: 1,
    backgroundColor: "#100E11",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
  },
  permissionTitle: {
    color: "#FFF9FC",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 16,
  },
  permissionText: {
    color: "#8D8792",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 24,
  },
  pinkButton: {
    backgroundColor: "#F66A9B",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
  },
  pinkButtonText: { color: "#171419", fontWeight: "900" },
});
