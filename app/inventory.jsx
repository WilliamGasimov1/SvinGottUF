import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/app-state";

export default function Inventory() {
  const { ingredients } = useAppState();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>DITT LAGER</Text>
            <Text style={styles.title}>I kylen</Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/scan")}
          >
            <Ionicons name="add" size={24} color="#171419" />
          </Pressable>
        </View>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={19} color="#8D8792" />
          <TextInput
            placeholder="Sök ingrediens..."
            placeholderTextColor="#8D8792"
            style={styles.input}
          />
        </View>
        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryValue}>{ingredients.length}</Text>
            <Text style={styles.summaryLabel}>ingredienser totalt</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View>
            <Text style={[styles.summaryValue, { color: "#F6B66A" }]}>
              {ingredients.filter((item) => item.expiring).length}
            </Text>
            <Text style={styles.summaryLabel}>använd först</Text>
          </View>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.sectionTitle}>Alla ingredienser</Text>
          <Pressable style={styles.filter}>
            <Ionicons name="options-outline" size={16} color="#F66A9B" />
            <Text style={styles.filterText}>Sortera</Text>
          </Pressable>
        </View>
        {ingredients.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="scan-outline" size={30} color="#F66A9B" />
            <Text style={styles.emptyTitle}>Inga ingredienser ännu</Text>
            <Text style={styles.emptyText}>
              Lägg bara till mat som faktiskt finns i ditt kylskåp.
            </Text>
          </View>
        ) : (
          ingredients.map((item) => (
            <View style={styles.item} key={item.id}>
              <View style={[styles.foodIcon, { backgroundColor: "#26362E" }]}>
                <Text style={styles.emoji}>{item.emoji || "🥣"}</Text>
              </View>
              <View style={styles.itemCopy}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.amount}>{item.quantity}</Text>
              </View>
              <View style={styles.days}>
                <Text style={item.expiring ? styles.warning : styles.fresh}>
                  {item.expiring ? "Snart" : "I lager"}
                </Text>
                <Text style={styles.daysLabel}>kvar</Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={18} color="#8D8792" />
            </View>
          ))
        )}
        <Pressable
          style={styles.scanButton}
          onPress={() => router.push("/scan")}
        >
          <Ionicons name="scan-outline" size={19} color="#171419" />
          <Text style={styles.scanText}>Skanna fler ingredienser</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#100E11" },
  container: { padding: 22, paddingBottom: 35 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  eyebrow: {
    color: "#8D8792",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "800",
  },
  title: { color: "#FFF9FC", fontSize: 30, fontWeight: "900", marginTop: 4 },
  addButton: {
    backgroundColor: "#F66A9B",
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    height: 48,
    backgroundColor: "#1A171C",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 9,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  input: { flex: 1, color: "#FFF9FC", fontSize: 14 },
  summary: {
    flexDirection: "row",
    backgroundColor: "#221C22",
    borderRadius: 19,
    marginTop: 18,
    padding: 18,
    alignItems: "center",
  },
  summaryValue: { color: "#F66A9B", fontSize: 26, fontWeight: "900" },
  summaryLabel: { color: "#8D8792", fontSize: 11, marginTop: 3 },
  summaryDivider: {
    height: 38,
    width: 1,
    backgroundColor: "#40333F",
    marginHorizontal: 30,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 13,
  },
  sectionTitle: { color: "#FFF9FC", fontSize: 17, fontWeight: "800" },
  filter: { flexDirection: "row", alignItems: "center", gap: 5 },
  filterText: { color: "#F66A9B", fontSize: 12, fontWeight: "800" },
  empty: {
    backgroundColor: "#1A171C",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#29232B",
    alignItems: "center",
    padding: 26,
    marginBottom: 15,
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
  },
  item: {
    backgroundColor: "#1A171C",
    borderRadius: 16,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  emoji: { fontSize: 25 },
  itemCopy: { flex: 1, marginLeft: 13 },
  name: { color: "#FFF9FC", fontSize: 14, fontWeight: "800" },
  amount: { color: "#8D8792", fontSize: 11, marginTop: 4 },
  days: { alignItems: "flex-end", marginRight: 13 },
  warning: { color: "#F6B66A", fontSize: 12, fontWeight: "800" },
  fresh: { color: "#8FD3A7", fontSize: 12, fontWeight: "800" },
  daysLabel: { color: "#8D8792", fontSize: 10, marginTop: 2 },
  scanButton: {
    marginTop: 15,
    borderColor: "#F66A9B",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  scanText: { color: "#F66A9B", fontSize: 13, fontWeight: "800" },
});
