import {getURL} from "./api.js"

// Will render the UI given a set of Pokemon objects
const renderPokemonCards = async (pokemons, filter = "") => {
    if (filter !== "")
        pokemons = pokemons.filter(e => e.name.toLowerCase().search(filter.toLowerCase()) + 1);
    if(!pokemons.length)
        return `<p class="h3">Sorry, but not results match your criteria</p>`
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
                  <a href="#/evo/${species.generation}" class="btn btn-block btn-primary">Show Evolution Chain</a>
                </div>
            </div>`
    }, "");
};
export default renderPokemonCards;
