import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
  const [params, setParams] = useSearchParams();

  const get = (key: string) => params.get(key) || "";

  const set = (key: string, value: string) => {
    const nextParams = new URLSearchParams(params);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    setParams(nextParams);
  };

  const setMany = (values: Record<string, string>) => {
    const nextParams = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    setParams(nextParams);
  };

  return { get, set, setMany, params };
}
