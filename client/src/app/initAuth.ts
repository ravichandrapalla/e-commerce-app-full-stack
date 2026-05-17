import { clearUser, setAuthReady, setUser } from "../features/auth/auth.slice";
import { getSelfApi } from "../services/auth.service";
import { store } from "../store/store";
import { toAuthUser } from "../types/auth";

const initAuth = async () => {
  try {
    const res = await getSelfApi();
    const user = res.data.user;
    store.dispatch(setUser(user ? toAuthUser(user) : null));
  } catch {
    store.dispatch(clearUser());
  } finally {
    store.dispatch(setAuthReady());
  }
};

export default initAuth;
