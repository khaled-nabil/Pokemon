// Pokemon class definition, constructs
class Pokemon {
    constructor({name, url, id, color, names, evolution_chain, varieties, ..._}) {
        this.name = name;
        this.url = url;
        this.id = id;
        this.color = color.name;
        this.translation = names;
        this.chain = evolution_chain.url;
        this.varieties = varieties;
    }

    // Get generation id
    get generation() {
        const chainLength = this.chain.length;
        return this.chain.substring(this.chain.substring(0, chainLength - 1).lastIndexOf("/") + 1, chainLength - 1);
    }

    get pokemons() {
        return this.varieties.map(pokemon => pokemon.pokemon);
    }

    get defaultPokemon() {
        return this.varieties.find(pokemon => pokemon.is_default).pokemon;
    }
}
export default Pokemon;
