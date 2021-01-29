import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

library.add(faDoorOpen);

export const exitIcon = icon({ prefix: "fas", iconName: "door-open" }).html;
