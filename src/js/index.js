// import "./utils/scroll-body.js";
import initPhoneClickFallback from "./components/phoneLink.js";
import initMenuDropdown from "./components/menu-dropdown.js";

import "./modules/header.js";
import "./modules/transfer.js";
import "./modules/burger.js";
import "./components/scrollToggle.js";
import { initRoomsSwiper } from "./modules/slider.js";
import "./modules/label.js";
import "./utils/form-validation.js";
import "./modules/animations.js";
import ScrollRevealFunc from "./modules/scrollreveal.js";
ScrollRevealFunc();
document.addEventListener("DOMContentLoaded", initMenuDropdown);
document.addEventListener("DOMContentLoaded", initPhoneClickFallback);
document.addEventListener("DOMContentLoaded", initRoomsSwiper);
