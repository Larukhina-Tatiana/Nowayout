import $ from "jquery";
import "../styles/main.scss";
import "./header.js";
import "./burger.js";
import "./scroll-button.js";
import "./slider.js";

// Импортируем все SVG-иконки из директории sprite-icons для генерации спрайта
require.context("../assets/icons/sprite-icons/", false, /\.svg$/);
