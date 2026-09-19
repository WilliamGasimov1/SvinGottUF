import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/app-state";

export default function Profile() {
  const { session, logout } = useAppState();
  const initial = session?.name?.charAt(0)?.toUpperCase() || "?";
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>DITT KONTO</Text>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.name}>{session?.name}</Text>
            <Text style={styles.email}>{session?.email}</Text>
          </View>
          <Ionicons name="pencil-outline" size={20} color="#F66A9B" />
        </View>
        <View style={styles.impact}>
          <Ionicons name="leaf" size={25} color="#8FD3A7" />
          <View style={styles.impactCopy}>
            <Text style={styles.impactTitle}>Din påverkan</Text>
            <Text style={styles.impactText}>
              Din statistik fylls på när du använder appen.
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Inställningar</Text>
        <View style={styles.settings}>
          <Setting
            icon="notifications-outline"
            title="Påminnelser"
            subtitle="Få koll innan maten blir dålig"
            toggle
          />
          <Setting
            icon="people-outline"
            title="Antal personer"
            subtitle="2 personer"
          />
          <Setting icon="language-outline" title="Språk" subtitle="Svenska" />
          <Setting icon="help-circle-outline" title="Hjälp & feedback" />
        </View>
        <Pressable
          style={styles.logout}
          onPress={async () => {
            await logout();
            router.replace("/auth");
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#F66A9B" />
          <Text style={styles.logoutText}>Logga ut</Text>
        </Pressable>
        <Text style={styles.footer}>Matreddare · Version 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
function Setting({ icon, title, subtitle, toggle }) {
  return (
    <View style={styles.setting}>
      <Ionicons name={icon} size={21} color="#F66A9B" />
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch
          value
          onValueChange={() => {}}
          trackColor={{ false: "#39333B", true: "#F66A9B" }}
          thumbColor="#FFF9FC"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#8D8792" />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#100E11" },
  container: { padding: 22 },
  eyebrow: {
    color: "#8D8792",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "800",
  },
  title: {
    color: "#FFF9FC",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 25,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A171C",
    borderRadius: 18,
    padding: 15,
    gap: 13,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  avatar: {
    width: 53,
    height: 53,
    borderRadius: 27,
    backgroundColor: "#F66A9B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "900", color: "#171419" },
  name: { color: "#FFF9FC", fontSize: 15, fontWeight: "900" },
  email: { color: "#8D8792", fontSize: 11, marginTop: 4 },
  impact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#24372D",
    borderRadius: 18,
    padding: 17,
    marginBottom: 29,
  },
  impactCopy: { marginLeft: 12 },
  impactTitle: { color: "#8FD3A7", fontSize: 14, fontWeight: "900" },
  impactText: { color: "#B8D7C2", fontSize: 11, marginTop: 5 },
  sectionTitle: {
    color: "#FFF9FC",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 13,
  },
  settings: {
    backgroundColor: "#1A171C",
    borderRadius: 18,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  setting: {
    minHeight: 67,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#29232B",
  },
  settingCopy: { flex: 1, marginLeft: 13 },
  settingTitle: { color: "#FFF9FC", fontSize: 13, fontWeight: "800" },
  settingSubtitle: { color: "#8D8792", fontSize: 11, marginTop: 4 },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#492936",
    borderRadius: 14,
    minHeight: 50,
    marginTop: 18,
  },
  logoutText: { color: "#F66A9B", fontSize: 13, fontWeight: "900" },
  footer: {
    color: "#5F5963",
    textAlign: "center",
    fontSize: 11,
    marginTop: 30,
  },
});
