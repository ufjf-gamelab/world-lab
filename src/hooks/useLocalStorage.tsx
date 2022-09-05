import { useCallback, useState } from "react";

interface useLocalStorageProps {
  key: string;
  initialValue: string;
}
function useLocalStorage(props: useLocalStorageProps) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(props.key);
      return storedValue ? JSON.parse(storedValue) : props.initialValue;
    } catch {
      return props.initialValue;
    }
  });
  const setValue = useCallback(
    (value: any) => {
      try {
        setState(value);
        localStorage.setItem(props.key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    },
    [props.key]
  );

  return [state, setValue];
}

export default useLocalStorage;
