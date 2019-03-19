import NotFound404 from "../views/notFound404.js"
import parseURL from "./parser.js"

const router = async (app, routes, data = {}) => {
    let request = parseURL();
    let url  = `/${request.resource}`;
    if(request.id && !isNaN(request.id))
        url += `/:num`;
    app.innerHTML = "";
    let comp =  routes[url] || NotFound404;
    app.innerHTML = await comp.render(data);
    comp.run(data);
};
export default router;
