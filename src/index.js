"use strict";
import Router from "./services/router.js"
import Home from "./views/home.js"
import EvoChain from "./views/evolutionChain.js"
import {toggleNavigation} from "./helpers/ui.js"

//define router routes
const routes = {
    '/': Home,
    '/evo/:num': EvoChain
};
const app = document.getElementById("pokemons");

window.addEventListener('load', function () {
    Router(app, routes)
});
window.addEventListener('hashchange', function () {
    Router(app, routes)
});
document.getElementById('filterForm').addEventListener('submit', function (evt) {
    evt.preventDefault();
    let data = Object.values(evt.target).reduce((obj, field) => {
        obj[field.name] = field.value;
        return obj
    }, {});
    Router(app, routes, data);
});

window.toggleNavigation = toggleNavigation;
