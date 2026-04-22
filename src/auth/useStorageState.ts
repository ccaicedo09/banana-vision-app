import { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export function useStorageState(key: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (Platform.OS === "web") {
          const stored = localStorage.getItem(key);
          setValue(stored);
        } else {
          const stored = await SecureStore.getItemAsync(key);
          setValue(stored);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [key]);

  const setStoredValue = useCallback(
    async (nextValue: string | null) => {
      setValue(nextValue);

      if (Platform.OS === "web") {
        if (nextValue === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, nextValue);
        }
        return;
      }

      if (nextValue === null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, nextValue);
      }
    },
    [key]
  );

  return { isLoading, value, setStoredValue };
}