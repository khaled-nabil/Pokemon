import Pokemon from "../pokemon"

const pokemonJson = JSON.stringify({
    "name": "bulbasaur",
    "url": "https://pokeapi.co/api/v2/pokemon-species/1/",
    "id": 1,
    "color": {"name": "green"},
    "names": [{
        "language": {"name": "zh-Hans", "url": "https://pokeapi.co/api/v2/language/12/"},
        "name": "妙蛙种子"
    }],
    "evolution_chain": {"url": "https://pokeapi.co/api/v2/evolution-chain/1/"},
    "varieties": [{
        "is_default": true,
        "pokemon": {"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"}
    }]
});
const rs = new Pokemon(JSON.parse(pokemonJson));
describe('Pokemon class', () => {

    it('returns pokemon object', async () => {
        expect(rs.constructor.name).toMatch("Pokemon");
    });

    it('get number of generations', async () => {
        expect(rs.generation).toEqual("1");
    });

    it('get pokemon varieties', async () => {
        let varieties = [{
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/'
        }];
        expect(rs.pokemons).toMatchObject(varieties);
    });

    it('get default pokemon', async () => {
        let pokemon = {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/'
        };
        expect(rs.defaultPokemon).toMatchObject(pokemon);
    });
});
