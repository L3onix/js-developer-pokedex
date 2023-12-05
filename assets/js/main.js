const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}"><span hidden>${pokemon.number}</span>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        const elements = document.getElementsByClassName('pokemon')
        for(let x = 0; x < elements.length; x++) {
            elements[x].addEventListener('click', onClickPokemon)
        }
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function onClickPokemon(event) {
    const id = event.currentTarget.firstChild.innerHTML
    loadPokemonDetails(id)
}

function loadPokemonDetails(id) {
    pokeApi.getPokemonById(id).then((pokemon) => {
        // console.log(pokemon)
        const sectionPokemonDetail = document.getElementById('pokemon-detail-section')
        const sectionPokemonList = document.getElementById("pokemon-list-section")
        sectionPokemonDetail.innerHTML += constructPokemonDetailHtml(pokemon)
        sectionPokemonDetail.classList.add(pokemon.types[0].type.name)
        sectionPokemonDetail.removeAttribute("hidden")
        sectionPokemonList.setAttribute("hidden", true)
    })
}

function constructPokemonDetailHtml(pokemon) {
    return `
        <h1 class="name">${pokemon.name}</h1>
        <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('')}
        </ol>
        <img src="${pokemon.sprites.other.dream_world.front_default}"/>
        <div class="info">
            <div>
                <ol><li>abas</li></ol>
            </div>
            <div>
                <table>
                    <tr>
                        <td>Species</td> <td>asdfasdf</td>
                    </tr>
                    <tr>
                        <td>Height</td> <td>${pokemon.height}</td>
                    </tr>
                    <tr>
                        <td>Weight</td> <td>${pokemon.weight}</td>
                    </tr>
                    <tr>
                        <td>Abilities</td> <td>asdfasdf</td>
                    </tr>
                </table>
            </div>
            <div>
                <h3>Breeding</h3>
                <table>
                    <tr>
                        <td>Gender</td> <td>asdfasdf</td>
                    </tr>
                    <tr>
                        <td>Egg groups</td> <td>asdfasdf</td>
                    </tr>
                    <tr>
                        <td>Egg cycle</td> <td>asdfasdf</td>
                    </tr>
                </table>
            </div>
        </div>
    `;
}
