// Generic form to get URL path
export const getURL = async (path) => {
    return fetch(path).then(e => e.json()).then(result => result).catch(error => {
        return {}
    });
};

// Main function responsible for fetch all species and pagination
export const fetchSpecies = async (page = 0) => {
    if (page < 0 || !Number.isInteger(parseInt(page))) page = 0;// just in case
    let paginatedSpecies = await getURL(`https://pokeapi.co/api/v2/pokemon-species?offset=${page * 20}&limit=20`);
    return paginatedSpecies.results;
};

// Function for fetching evolution chain of a pokemon species
export const fetchEvolutionChain = async (id) => {
    let URI = `https://pokeapi.co/api/v2/evolution-chain/${id}`;
    let evoChain = await getURL(URI);
    return evoChain.chain;
};
