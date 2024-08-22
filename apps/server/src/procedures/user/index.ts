import { router } from "../../server";
import { updateProfile } from "./mutations";
import { getMultiple, getSingle } from "./queries";

export const user = router({
    updateProfile,
    getSingle,
    getMultiple,
});
