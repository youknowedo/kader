import { router } from "../../server";
import { validate } from "./queries";

export const session = router({
    validate,
});
