import { router } from "../../server";
import { queries } from "./queries";
export const vendor = router({
    ...queries,
});
