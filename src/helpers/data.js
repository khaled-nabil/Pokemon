import {getURL} from "./api.js"
import Pokemon from "../schemas/pokemon.js"

// Will take an array of species and return a mapped array Pokemon objects
export const createPokemonObjects = async (speciesArray) => {
    let allSpecies = await speciesArray.map(async species => {
        let speciesDetails = await getURL(species.url);
        return new Pokemon(Object.assign({}, species, speciesDetails));
    });
    return Promise.all(allSpecies).then(pokemons => pokemons);
};

// Generates an array of paths to the decedents to be used to create Pokemon objects
export const getTreeArray = (object, result = []) => {
    if (object.evolves_to.length > 0) {
        object.evolves_to.forEach(evo => { // Find each and every descendant tree and append it to current array
            result = result.concat(getTreeArray(evo))
        });
    }
    result.push(object.species);
    return result;
};
