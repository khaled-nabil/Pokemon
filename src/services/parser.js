const parseURL = () => {
    let url = location.hash.slice(1).toLowerCase() || '/';
    let fragments = url.split("/");
    return {
        resource: fragments[1] || '',
        id: fragments[2] || '',
    };
};
export default parseURL;
