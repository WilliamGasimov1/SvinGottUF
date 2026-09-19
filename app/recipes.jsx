import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../src/app-state";

export default function Recipes() {
  const { ingredients } = useAppState();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>SMART INSPIRATION</Text>
            <Text style={styles.title}>Recept för dig</Text>
          </View>
          <Ionicons name="sparkles" size={25} color="#F66A9B" />
        </View>
        <Text style={styles.intro}>
          Recepten är valda för att använda det som behöver ätas först.
        </Text>
        <View style={styles.chips}>
          <Pressable style={styles.activeChip}>
            <Text style={styles.activeChipText}>Bäst match</Text>
          </Pressable>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Snabbt</Text>
          </Pressable>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Vegetariskt</Text>
          </Pressable>
        </View>
        {ingredients.length === 0 ? <View style={styles.empty}><Ionicons name="restaurant-outline" size={34} color="#F66A9B" /><Text style={styles.emptyTitle}>Inga recept ännu</Text><Text style={styles.emptyText}>När du har skannat ingredienser skapar vi recept utifrån just din kyl.</Text></View> : (
          <View style={styles.empty}><Ionicons name="sparkles-outline" size={34} color="#F66A9B" /><Text style={styles.emptyTitle}>Recept skapas snart</Text><Text style={styles.emptyText}>{ingredients.length} ingredienser är redo för AI-matchning.</Text></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#100E11" },
  container: { padding: 22, paddingBottom: 35 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  eyebrow: {
    color: "#8D8792",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "800",
  },
  title: { color: "#FFF9FC", fontSize: 29, fontWeight: "900", marginTop: 4 },
  intro: { color: "#AFA7B1", fontSize: 13, lineHeight: 19, width: "88%" },
  chips: { flexDirection: "row", gap: 8, marginTop: 22, marginBottom: 17 },
  activeChip: {
    backgroundColor: "#F66A9B",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  activeChipText: { color: "#171419", fontSize: 11, fontWeight: "900" },
  chip: {
    backgroundColor: "#1A171C",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  chipText: { color: "#AFA7B1", fontSize: 11, fontWeight: "800" },
  empty: { backgroundColor: "#1A171C", borderRadius: 18, borderWidth: 1, borderColor: "#29232B", alignItems: "center", padding: 28, marginTop: 8 },
  emptyTitle: { color: "#FFF9FC", fontSize: 16, fontWeight: "900", marginTop: 11 },
  emptyText: { color: "#8D8792", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7, maxWidth: 280 },
  card: {
    backgroundColor: "#1A171C",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#29232B",
  },
  image: { height: 135, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 67 },
  match: {
    position: "absolute",
    top: 11,
    left: 11,
    backgroundColor: "#F66A9B",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexDirection: "row",
    gap: 4,
  },
  matchText: { fontSize: 10, fontWeight: "900" },
  cardBody: { padding: 15 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeTitle: { color: "#FFF9FC", fontSize: 17, fontWeight: "900" },
  meta: { color: "#8D8792", fontSize: 11, marginTop: 8 },
  copy: { color: "#F66A9B", fontSize: 11, fontWeight: "700", marginTop: 11 },
});
