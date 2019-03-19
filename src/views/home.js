import renderPokemonCards from "../helpers/pokemonCards.js"
import {fetchSpecies} from "../helpers/api.js"
import { createPokemonObjects } from "../helpers/data.js"

const Home = {
    render: async ({filter, page}) => {
        let species = await fetchSpecies(page);
        let pokemonObjs = await createPokemonObjects(species);
        return await renderPokemonCards(pokemonObjs,filter);
    }
    , run: async (_) => {
        document.getElementById("title").innerHTML = `Pokemon Species (Catch them all)`;
    }
};
export default Home;
