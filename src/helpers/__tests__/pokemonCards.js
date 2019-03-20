import renderPokemonCards from "../pokemonCards"
import Pokemon from "../../schemas/pokemon"

const pokemonJson = JSON.stringify({
    "name": "bulbasaur",
    "url": "https://pokeapi.co/api/v2/pokemon-species/1/",
    "id": 1,
    "color": {"name": "green"},
    "names": [{
        "language": {"name": "de", "url": "https://pokeapi.co/api/v2/language/6/"},
        "name": "Bisaknosp"
    }],
    "evolution_chain": {"url": "https://pokeapi.co/api/v2/evolution-chain/1/"},
    "varieties": [{
        "is_default": true,
        "pokemon": {"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"}
    }]
});
const pokemons = [new Pokemon(JSON.parse(pokemonJson))];

describe('Render Pokemon cards in UI', () => {
    beforeEach(() => {
        fetch.resetMocks()
    });
    it('No pokemons passed, return message', async () => {
        let rs = await renderPokemonCards({});
        expect(rs).toMatch(`<p class="h3">Sorry, but not results match your criteria</p>`);
    });

    it('return pokemon card and fetches photos', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                "sprites": {"front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"},
                "name": "bulbasaur",
            })
        );
        const rs = await renderPokemonCards(pokemons);
        const node = document.createElement("div");
        node.innerHTML = rs;
        const header = node.querySelector('.card-header');
        expect(header.innerHTML).toContain("bulbasaur");
        expect(fetch.mock.calls[0][0]).toEqual('https://pokeapi.co/api/v2/pokemon/1/');
        expect(fetch.mock.calls.length).toEqual(1)
    });
});
