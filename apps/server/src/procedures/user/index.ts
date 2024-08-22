import { router } from "../../server";
import { mutations } from "./mutations";
import { queries } from "./queries";

export const user = router({
    queries,
    mutations,
});
