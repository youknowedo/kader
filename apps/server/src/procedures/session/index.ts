import { router } from "../../server";
import { queries } from "./queries";

export const session = router({ ...queries });
