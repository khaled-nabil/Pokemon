import {getURL, fetchSpecies, fetchEvolutionChain} from "../api"

describe('API calls', () => {
    beforeEach(() => {
        fetch.resetMocks()
    });

    it('calls api and return JSON once', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({"name": "charmander", "url": "https://pokeapi.co/api/v2/pokemon-species/4/"}, {status: 200})
        );

        let rs = await getURL("localhost");
        expect(rs).toEqual({"name": "charmander", "url": "https://pokeapi.co/api/v2/pokemon-species/4/"});
        expect(fetch.mock.calls.length).toEqual(1)

    });
    it('fail api call, return empty json', async () => {
        fetch.mockRejectOnce();

        let rs = await getURL("localhost");
        expect(rs).toEqual({});
        expect(fetch.mock.calls.length).toEqual(1)
    });

    it('Fetch Species Json with correct URL once', async () => {
        let json = JSON.stringify({
            "count": 807,
            "next": "https://pokeapi.co/api/v2/pokemon-species?offset=1&limit=1",
            "previous": null,
            "results": [{"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon-species/1/"}]
        });
        fetch.mockResponseOnce(json);

        let rs = await fetchSpecies(0);
        expect(rs).toEqual(JSON.parse(json).results);
        expect(fetch.mock.calls[0][0]).toEqual('https://pokeapi.co/api/v2/pokemon-species?offset=0&limit=20');
        expect(fetch.mock.calls.length).toEqual(1)

    });

    it('Fetch Species Json with correct URL once', async () => {
        let json = JSON.stringify({
            "baby_trigger_item": null, "chain": {
                "evolution_details": [],
                "evolves_to": [{
                    "evolution_details": [{
                    }],
                    "evolves_to": [{
                        "evolution_details": [{
                        }],
                        "evolves_to": [],
                        "is_baby": false,
                        "species": {"name": "venusaur", "url": "https://pokeapi.co/api/v2/pokemon-species/3/"}
                    }],
                    "is_baby": false,
                    "species": {"name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon-species/2/"}
                }],
                "is_baby": false,
                "species": {"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon-species/1/"}
            }, "id": 1
        });
        fetch.mockResponseOnce(json);

        let rs = await fetchEvolutionChain(1);
        expect(rs).toEqual(JSON.parse(json).chain);
        expect(fetch.mock.calls[0][0]).toEqual('https://pokeapi.co/api/v2/evolution-chain/1');
        expect(fetch.mock.calls.length).toEqual(1)

    });
});
