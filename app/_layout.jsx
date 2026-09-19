import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppStateProvider, useAppState } from "../src/app-state";

export default function Layout() {
  return (
    <AppStateProvider>
      <RootNavigator />
    </AppStateProvider>
  );
}

function RootNavigator() {
  const { ready, session } = useAppState();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.pink} size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
      </Stack>
    );
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.pink,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            index: focused ? "home" : "home-outline",
            inventory: focused ? "cube" : "cube-outline",
            recipes: focused ? "restaurant" : "restaurant-outline",
            profile: focused ? "person" : "person-outline",
          };
          return <Ionicons name={icons[route.name]} size={21} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Hem" }} />
      <Tabs.Screen name="inventory" options={{ title: "Kyl" }} />
      <Tabs.Screen name="recipes" options={{ title: "Recept" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
      <Tabs.Screen name="scan" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="auth" options={{ href: null }} />
    </Tabs>
  );
}

const COLORS = {
  pink: "#F66A9B",
  muted: "#8D8792",
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#171419",
    borderTopColor: "#29232B",
    height: 82,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  loading: {
    flex: 1,
    backgroundColor: "#100E11",
    alignItems: "center",
    justifyContent: "center",
  },
});
