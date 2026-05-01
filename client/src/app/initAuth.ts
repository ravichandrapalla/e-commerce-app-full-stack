import { clearUser, setUser } from "../features/auth/auth.slice";
import { getSelfApi } from "../services/auth.service";
import { store } from "../store/store";

const initAuth = async () => {
  try {
    const res = await getSelfApi();
    store.dispatch(setUser(res.data.user));
  } catch {
    store.dispatch(clearUser());
  }
};

export default initAuth;
