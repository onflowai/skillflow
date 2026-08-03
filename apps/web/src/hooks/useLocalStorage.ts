import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type {
  Dispatch,
  SetStateAction,
} from 'react';

function readStoredValue<T>(
  key: string,
  initialValue: T,
): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const storedValue =
      window.localStorage.getItem(key);

    return storedValue === null
      ? initialValue
      : (JSON.parse(storedValue) as T);
  } catch (error) {
    console.error(
      `Error reading localStorage key "${key}":`,
      error,
    );

    return initialValue;
  }
}

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] =
    useState<T>(() =>
      readStoredValue(key, initialValue),
    );

  useEffect(() => {
    setStoredValue(
      readStoredValue(key, initialValue),
    );
  }, [key, initialValue]);

  const setValue = useCallback<
    Dispatch<SetStateAction<T>>
  >(
    (value) => {
      setStoredValue((currentValue) => {
        const valueToStore =
          typeof value === 'function'
            ? (
                value as (
                  previousValue: T,
                ) => T
              )(currentValue)
            : value;

        try {
          if (typeof window !== 'undefined') {
            if (
              valueToStore === null ||
              valueToStore === undefined
            ) {
              window.localStorage.removeItem(key);
            } else {
              window.localStorage.setItem(
                key,
                JSON.stringify(valueToStore),
              );
            }
          }
        } catch (error) {
          console.error(
            `Error setting localStorage key "${key}":`,
            error,
          );
        }

        return valueToStore;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}

export default useLocalStorage;