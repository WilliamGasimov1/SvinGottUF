import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/app-state";

export default function Index() {
  const { session, ingredients } = useAppState();
  const firstName = session?.name?.split(" ")[0] || "där";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>DITT PERSONLIGA MATLAGER</Text>
            <Text style={styles.title}>
              Hej, {firstName} <Text style={styles.wave}>✦</Text>
            </Text>
          </View>
          <Pressable
            style={styles.avatar}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.avatarText}>O</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>MINSKA MATSVINNET</Text>
            <Text style={styles.heroTitle}>Gör mer av det du redan har.</Text>
            <Text style={styles.heroBody}>
              Skanna ditt kylskåp och få smarta recept baserade på dina
              ingredienser.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push("/scan")}
            >
              <Ionicons name="scan-outline" size={19} color="#171419" />
              <Text style={styles.primaryButtonText}>Skanna kylskåpet</Text>
            </Pressable>
          </View>
          <View style={styles.heroOrb}>
            <Text style={styles.heroOrbText}>✦</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Din kyl just nu</Text>
          <Pressable onPress={() => router.push("/inventory")}>
            <Text style={styles.link}>Visa alla</Text>
          </Pressable>
        </View>
        <View style={styles.statsRow}>
          <StatCard
            icon="leaf-outline"
            value={String(ingredients.length)}
            label="ingredienser"
            color="#F66A9B"
          />
          <StatCard
            icon="time-outline"
            value={String(ingredients.filter((item) => item.expiring).length)}
            label="snart slut"
            color="#F6B66A"
          />
          <StatCard
            icon="sparkles-outline"
            value={String(ingredients.length ? 1 : 0)}
            label="recept redo"
            color="#A995E8"
          />
        </View>

        {ingredients.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Använd först</Text>
              <Text style={styles.expiryHint}>
                {ingredients.filter((item) => item.expiring).length} varor snart
                dåliga
              </Text>
            </View>
            {ingredients
              .filter((item) => item.expiring)
              .slice(0, 2)
              .map((item) => (
                <View style={styles.expiringCard} key={item.id}>
                  <FoodIcon emoji={item.emoji || "🥣"} background="#26362E" />
                  <View style={styles.foodCopy}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodMeta}>
                      {item.quantity} · behöver användas snart
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8D8792" />
                </View>
              ))}
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dagens inspiration</Text>
          <Text style={styles.pill}>
            {ingredients.length ? "REDO ATT SKAPA" : "NÄR DU SKANNAT"}
          </Text>
        </View>
        <View style={styles.recipeCard}>
          <View style={styles.recipeImage}>
            <Text style={styles.recipeEmoji}>
              {ingredients.length ? "✨" : "🍽️"}
            </Text>
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>
              {ingredients.length
                ? "Ditt första recept väntar"
                : "Skanna för personliga recept"}
            </Text>
            <Text style={styles.foodMeta}>
              {ingredients.length
                ? "AI matchar dina ingredienser"
                : "Inga recept visas innan du lagt till mat"}
            </Text>
            <Text style={styles.recipeUse}>
              {ingredients.length
                ? "Använd din kyl för att skapa något gott"
                : "Ditt konto börjar helt tomt"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
function FoodIcon({ emoji, background }) {
  return (
    <View style={[styles.foodIcon, { backgroundColor: background }]}>
      <Text style={styles.foodEmoji}>{emoji}</Text>
    </View>
  );
}
function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="cube-outline" size={32} color="#F66A9B" />
      <Text style={styles.emptyTitle}>Din kyl är tom</Text>
      <Text style={styles.emptyText}>
        Skanna ditt kylskåp för att lägga till dina egna ingredienser.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#100E11" },
  container: { padding: 22, paddingBottom: 35 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  eyebrow: {
    color: "#8D8792",
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: "800",
    marginBottom: 6,
  },
  title: {
    color: "#FFF9FC",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  wave: { color: "#F66A9B", fontSize: 22 },
  avatar: {
    backgroundColor: "#F66A9B",
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#171419", fontSize: 17, fontWeight: "900" },
  hero: {
    backgroundColor: "#EFA0B8",
    borderRadius: 26,
    minHeight: 260,
    padding: 23,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 28,
  },
  heroCopy: { width: "74%", zIndex: 2 },
  heroKicker: {
    color: "#6E374C",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: "#21141B",
    fontSize: 29,
    lineHeight: 33,
    fontWeight: "900",
    marginTop: 11,
  },
  heroBody: { color: "#633D4B", fontSize: 13, lineHeight: 19, marginTop: 12 },
  primaryButton: {
    backgroundColor: "#FFF9FC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 18,
  },
  primaryButtonText: { color: "#171419", fontWeight: "800", fontSize: 13 },
  heroOrb: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 100,
    backgroundColor: "#F8C8D8",
    right: -48,
    bottom: -32,
    alignItems: "center",
    justifyContent: "center",
  },
  heroOrbText: { color: "#F66A9B", fontSize: 60 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    marginTop: 2,
  },
  sectionTitle: { color: "#FFF9FC", fontSize: 17, fontWeight: "800" },
  link: { color: "#F66A9B", fontSize: 12, fontWeight: "800" },
  expiryHint: { color: "#F6B66A", fontSize: 11, fontWeight: "700" },
  pill: {
    color: "#F66A9B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  empty: {
    backgroundColor: "#1A171C",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#29232B",
    alignItems: "center",
    padding: 24,
    marginBottom: 25,
  },
  emptyTitle: {
    color: "#FFF9FC",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },
  emptyText: {
    color: "#8D8792",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 6,
    maxWidth: 260,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A171C",
    borderRadius: 17,
    padding: 14,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  statValue: {
    color: "#FFF9FC",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: { color: "#8D8792", fontSize: 10, marginTop: 2 },
  expiringCard: {
    backgroundColor: "#1A171C",
    borderRadius: 17,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  foodIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  foodEmoji: { fontSize: 25 },
  foodCopy: { flex: 1, marginLeft: 13 },
  foodName: { color: "#FFF9FC", fontSize: 14, fontWeight: "800" },
  foodMeta: { color: "#8D8792", fontSize: 11, marginTop: 4 },
  recipeCard: {
    backgroundColor: "#1A171C",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#29232B",
  },
  recipeImage: {
    backgroundColor: "#6B3D3C",
    width: 92,
    height: 100,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  recipeEmoji: { fontSize: 47 },
  matchBadge: {
    position: "absolute",
    left: 7,
    bottom: 7,
    backgroundColor: "#F66A9B",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: "row",
    gap: 3,
  },
  matchText: { fontSize: 10, fontWeight: "900" },
  recipeInfo: { flex: 1, marginHorizontal: 13 },
  recipeTitle: {
    color: "#FFF9FC",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  recipeUse: {
    color: "#F66A9B",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 8,
    lineHeight: 14,
  },
});
