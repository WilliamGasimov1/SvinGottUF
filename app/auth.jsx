import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/app-state";

export default function Auth() {
  const { login, register } = useAppState();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function submit() {
    if (!email.trim() || !password || (isRegister && !name.trim())) {
      Alert.alert(
        "Fyll i allt",
        "Ange namn, e-post och lösenord för att fortsätta.",
      );
      return;
    }
    setBusy(true);
    try {
      if (isRegister) await register({ name, email, password });
      else await login(email, password);
      router.replace("/");
    } catch (error) {
      Alert.alert("Kunde inte fortsätta", error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandMark}>
            <Ionicons name="leaf" size={28} color="#171419" />
          </View>
          <Text style={styles.kicker}>MATREDDARNA</Text>
          <Text style={styles.title}>Maten börjar här.</Text>
          <Text style={styles.subtitle}>
            Skapa ditt privata kylskåp och få recept som hjälper dig att använda
            allt.
          </Text>
          <View style={styles.switcher}>
            <Pressable
              style={[styles.switch, !isRegister && styles.switchActive]}
              onPress={() => setMode("login")}
            >
              <Text
                style={[
                  styles.switchText,
                  !isRegister && styles.switchTextActive,
                ]}
              >
                Logga in
              </Text>
            </Pressable>
            <Pressable
              style={[styles.switch, isRegister && styles.switchActive]}
              onPress={() => setMode("register")}
            >
              <Text
                style={[
                  styles.switchText,
                  isRegister && styles.switchTextActive,
                ]}
              >
                Registrera
              </Text>
            </Pressable>
          </View>
          {isRegister && (
            <Field
              icon="person-outline"
              placeholder="Ditt namn"
              value={name}
              onChangeText={setName}
            />
          )}
          <Field
            icon="mail-outline"
            placeholder="E-postadress"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            icon="lock-closed-outline"
            placeholder="Lösenord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable
            style={[styles.submit, busy && styles.disabled]}
            onPress={submit}
            disabled={busy}
          >
            <Text style={styles.submitText}>
              {busy ? "Vänta..." : isRegister ? "Skapa mitt konto" : "Logga in"}
            </Text>
            <Ionicons name="arrow-forward" size={19} color="#171419" />
          </Pressable>
          <Text style={styles.terms}>
            Ditt konto och dina ingredienser sparas lokalt på den här enheten.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ icon, ...props }) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={19} color="#8D8792" />
      <TextInput
        {...props}
        placeholderTextColor="#8D8792"
        style={styles.input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#100E11" },
  container: { padding: 25, paddingTop: 38, flexGrow: 1 },
  brandMark: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#F66A9B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  kicker: {
    color: "#F66A9B",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: { color: "#FFF9FC", fontSize: 34, fontWeight: "900", marginTop: 10 },
  subtitle: {
    color: "#AFA7B1",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 330,
  },
  switcher: {
    flexDirection: "row",
    backgroundColor: "#1A171C",
    padding: 4,
    borderRadius: 14,
    marginTop: 30,
    marginBottom: 17,
  },
  switch: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 11,
  },
  switchActive: { backgroundColor: "#F66A9B" },
  switchText: { color: "#8D8792", fontSize: 13, fontWeight: "800" },
  switchTextActive: { color: "#171419" },
  field: {
    backgroundColor: "#1A171C",
    borderRadius: 14,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  input: { flex: 1, color: "#FFF9FC", fontSize: 14 },
  submit: {
    backgroundColor: "#F66A9B",
    borderRadius: 14,
    minHeight: 54,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  submitText: { color: "#171419", fontSize: 14, fontWeight: "900" },
  disabled: { opacity: 0.6 },
  terms: {
    color: "#5F5963",
    textAlign: "center",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 22,
  },
});
