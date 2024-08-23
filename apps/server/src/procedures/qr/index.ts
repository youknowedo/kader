import { router } from "../../server";
import { mutations } from "./mutations";
import { queries } from "./queries";

export const qr = router({
    ...queries,
    ...mutations,
});
