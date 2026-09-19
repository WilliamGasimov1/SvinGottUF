import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const SESSION_KEY = "foodapp.session";
const USERS_KEY = "foodapp.users";
const DATA_PREFIX = "foodapp.data.";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  const loadUserData = useCallback(async (email) => {
    const saved = await AsyncStorage.getItem(`${DATA_PREFIX}${email}`);
    const data = saved ? JSON.parse(saved) : { ingredients: [], recipes: [] };
    setIngredients(data.ingredients || []);
    setRecipes(data.recipes || []);
  }, []);

  const hydrate = useCallback(async () => {
    const savedSession = await AsyncStorage.getItem(SESSION_KEY);
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
      await loadUserData(parsedSession.email);
    }
    setReady(true);
  }, [loadUserData]);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    hydrate();
  }, [hydrate]);

  async function saveUserData(email, nextIngredients, nextRecipes = recipes) {
    await AsyncStorage.setItem(
      `${DATA_PREFIX}${email}`,
      JSON.stringify({ ingredients: nextIngredients, recipes: nextRecipes }),
    );
  }

  async function register({ name, email, password }) {
    const users = JSON.parse((await AsyncStorage.getItem(USERS_KEY)) || "{}");
    const normalizedEmail = email.trim().toLowerCase();
    if (users[normalizedEmail])
      throw new Error("Det finns redan ett konto med den e-posten.");
    const user = { name: name.trim(), email: normalizedEmail, password };
    users[normalizedEmail] = user;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    await loadUserData(normalizedEmail);
    setSession(user);
  }

  async function login(email, password) {
    const users = JSON.parse((await AsyncStorage.getItem(USERS_KEY)) || "{}");
    const user = users[email.trim().toLowerCase()];
    if (!user || user.password !== password)
      throw new Error("Fel e-post eller lösenord.");
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    await loadUserData(user.email);
    setSession(user);
  }

  async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
    setIngredients([]);
    setRecipes([]);
  }

  async function addIngredients(newItems) {
    if (!session) return;
    const stamped = newItems.map((item, index) => ({
      ...item,
      id: `${Date.now()}-${index}`,
    }));
    const next = [...ingredients, ...stamped];
    setIngredients(next);
    await saveUserData(session.email, next, recipes);
  }

  return (
    <AppStateContext.Provider
      value={{
        session,
        ready,
        ingredients,
        recipes,
        register,
        login,
        logout,
        addIngredients,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value)
    throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
