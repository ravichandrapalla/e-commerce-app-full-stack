import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
  const [params, setParams] = useSearchParams();

  const get = (key: string) => params.get(key) || "";

  const set = (key: string, value: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
    setParams(params);
  };

  return { get, set, params };
}
