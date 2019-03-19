const parseURL = () => {

    let url = location.hash.slice(1).toLowerCase() || '/';
    let fragments = url.split("/");
    return {
        resource: fragments[1] || '',
        id: fragments[2] || '',
    };
};
const router = async (routes) => {
    let request = parseURL();
    let url  = `/${request.resource}`;
    if(Number.isInteger(request.id))
        url += `/:num`;
    console.log(url);
    return routes[url] || NotFound404
};
export default router;
