'use strict'
// Generic form to get URL path
const getURL = async (path) => {
    return fetch(path).then(e => e.json()).then(result => result).catch(error => {
        console.error(error);
        return {}
    });
};

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

// Will render the UI given a set of Pokemon objects
const renderPokemonCards = async (pokemons, filter = "") => {
    if (filter !== "")
        pokemons = pokemons.filter(e => e.name.toLowerCase().search(filter.toLowerCase()) + 1);
    return pokemons.reduce(async (prv, species) => {
        const photo = await getURL(species.defaultPokemon.url);
        let sprites = [];
        for (let key in photo.sprites) {
            if (photo.sprites[key] !== null) sprites.push(photo.sprites[key]);
        }
        const renderedSprites = sprites.reduce((p, c, i) => `${p}<div class="mask d-inline-block"><img width="64" src="${c}" alt="${photo.name} photo ${i + 1}" /></div>`, "");
        const descendants = species.pokemons.reduce((before, current) => `${before}<li class="text-capitalize">${current.name}</li>`, "");
        const translatedName = species.translation.find(lang => lang.language.name === "de");
        return `${await prv}
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                <div class="card h-100 d-flex flex-column">
                <h2 class="card-header text-center h4 text-capitalize">
                    ${species.name}
                </h2>
                <img src="${photo.sprites.front_default}" class="card-img-top" alt="${photo.name}">
                  <div class="card-body flex-grow">
                    <div class="text-center skewed"><div class="unskew">${renderedSprites}</div></div>
                    <h3 class="h4">Descendants</h3>
                    <ul>
                        ${descendants}
                    </ul>
                    <p class="card-text"><strong>Color:</strong> <span class="text-capitalize">${species.color}</span></p>
                    <p><strong>German Name: </strong> ${translatedName.name}</p>
                  </div>
                  <a target="_blank" href="./?id=${species.generation}" class="btn btn-block btn-primary">Show Evolution Chain</a>
                </div>
            </div>`
    }, "");
};
// Will take an array of species and return a mapped array Pokemon objects
const createPokemonObjects = async (speciesArray) => {
    const allSpecies = await speciesArray.map(async species => {
        let speciesDetails = await getURL(species.url);
        return new Pokemon(Object.assign({}, species, speciesDetails));
    });
    return Promise.all(allSpecies).then(pokemons => pokemons);
};
// Generates an array of paths to the decedents to be used to create Pokemon objects
const getTreeArray = (object, result = []) => {
    if (object.evolves_to.length > 0) {
        object.evolves_to.forEach(evo => { // Find each and every descendant tree and append it to current array
            result = result.concat(getTreeArray(evo))
        });
    }
    result.push(object.species);
    return result;
};
// Main function responsible for fetch all species and pagination
const fetchSpecies = async (page = 0) => {
    if (page < 0 || !Number.isInteger(parseInt(page))) page = 0;// just in case
    const paginatedSpecies = await getURL(`https://pokeapi.co/api/v2/pokemon-species?offset=${page * 20}&limit=20`);
    return createPokemonObjects(paginatedSpecies.results);
};
// Function for fetching evolution chain of a pokemon species
const fetchEvolutionChain = async (id) => {
    const URI = `https://pokeapi.co/api/v2/evolution-chain/${id}`;
    const evoChain = await getURL(URI);
    return createPokemonObjects(await getTreeArray(evoChain.chain))
};

async function main(page = 0, filter) {
    // if species id exist then fetch species tree, otherwise fetch all
    const speciesIdentifier = parseInt(window.location.search.split("=")[1]);
    if (speciesIdentifier === undefined || !Number.isInteger(speciesIdentifier)) {
        // general case
        document.getElementById("title").innerHTML = `Pokemon Species (Catch them all)`;
        document.getElementById("pokemons").innerHTML = await renderPokemonCards(await fetchSpecies(page), filter);
    } else {
        // specific species: render tree of descendants
        document.getElementById("title").innerHTML = `Viewing Species Tree`;
        document.getElementById("pokemons").innerHTML = await renderPokemonCards(await fetchEvolutionChain(speciesIdentifier), filter);
    }
}

// UI helpers
function toggleNavigation(identifier) { // Toggle navigation
    document.getElementById(identifier).classList.toggle("toggled");
}

// Filter form
function formChanges(id) {
    const data = Object.values(document.getElementById(id)).reduce((obj, field) => {
        obj[field.name] = field.value;
        return obj
    }, {});
    document.getElementById("pokemons").innerHTML = "";
    main(data.page, data.filter);
}

// Run main code
main();
