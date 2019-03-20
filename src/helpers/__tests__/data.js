import {createPokemonObjects, getTreeArray} from "../data"
import Pokemon from "../../schemas/pokemon"

jest.mock("../../schemas/pokemon");

beforeEach(() => {
    Pokemon.mockClear();
});

describe('Data structuring', () => {

    it('Get Pokemon prototypes using Pokemon class', async () => {
        const spciesApiResponse = JSON.stringify({
            "count": 807,
            "next": "https://pokeapi.co/api/v2/pokemon-species?offset=1&limit=1",
            "previous": null,
            "results": [{"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon-species/1/"}]
        });
        expect(Pokemon).not.toHaveBeenCalled();
        let rs = await createPokemonObjects(JSON.parse(spciesApiResponse).results);
        expect(Pokemon).toHaveBeenCalledTimes(1);
        expect(rs[0]).toMatchObject(new Pokemon("data"));
    });

    it('Get a tree of evolution chain', async () => {
        const chainApiResponse = JSON.stringify({
            "evolves_to": [{
                "evolves_to": [{
                    "evolves_to": [],
                    "species": {"name": "venusaur", "url": "https://pokeapi.co/api/v2/pokemon-species/3/"}
                }],
                "species": {"name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon-species/2/"}
            }],
            "species": {"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon-species/1/"}
        });
        let rs = getTreeArray(JSON.parse(chainApiResponse));
        expect(rs).toEqual([{
            name: 'venusaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/3/'
        },
            {
                name: 'ivysaur',
                url: 'https://pokeapi.co/api/v2/pokemon-species/2/'
            },
            {
                name: 'bulbasaur',
                url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
            }])
    });

});
