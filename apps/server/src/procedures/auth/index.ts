import { router } from "../../server.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { signup } from "./signup.js";

export const auth = router({
    signup,
    login,
    logout,
});
