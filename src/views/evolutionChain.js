import renderPokemonCards from "../helpers/pokemonCards.js"
import {fetchEvolutionChain} from "../helpers/api.js"
import {createPokemonObjects, getTreeArray} from "../helpers/data.js"
import parseURL from "../services/parser.js"

const evoChain = {
    render: async ({filter, page}) => {
        let request = parseURL();
        let species = await fetchEvolutionChain(request.id);
        let pokemonObjs = await createPokemonObjects(getTreeArray(species));
        return await renderPokemonCards(pokemonObjs, filter);
    }
    , run: async (_) => {
        document.getElementById("title").innerHTML = `Viewing Species Tree`;
    }
};
export default evoChain;
