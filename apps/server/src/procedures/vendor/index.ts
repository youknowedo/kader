import { router } from "../../server";
import { getMultiple, getSingle } from "./queries";

export const vendor = router({
    getSingle,
    getMultiple,
});
