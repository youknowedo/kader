import { router } from "../../server.js";
import { queries } from "./queries.js";

export const qr = router({
    ...queries,
});
