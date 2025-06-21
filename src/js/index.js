import $ from "jquery";
import "../styles/main.scss";
import "./header.js";
// import "./scrollreveal.js";
import "./burger.js";
import "./scroll-button.js";
import "./slider.js";
import ScrollReveal from "./scrollreveal.js";
ScrollReveal();

// Импортируем все SVG-иконки из директории sprite-icons для генерации спрайта
require.context("../assets/icons/sprite-icons/", false, /\.svg$/);
