import { router } from "../../server";
import { queries } from "./queries";

export const qr = router({
    ...queries,
});
