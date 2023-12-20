const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}"><span hidden>${
    pokemon.number
  }</span>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
    const elements = document.getElementsByClassName("pokemon");
    for (let x = 0; x < elements.length; x++) {
      elements[x].addEventListener("click", onClickPokemon);
    }
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function onClickPokemon(event) {
  const id = event.currentTarget.firstChild.innerHTML;
  loadPokemonDetails(id);
}

function onClickCloseButton(event) {
  const sectionPokemonDetail = document.getElementById(
    "pokemon-detail-section"
  );
  const sectionPokemonList = document.getElementById("pokemon-list-section");
  sectionPokemonList.removeAttribute("hidden");
  sectionPokemonDetail.classList.add("hidden");
}

function loadPokemonDetails(id) {
  pokeApi.getPokemonById(id).then((pokemon) => {
    const sectionPokemonDetail = document.getElementById(
      "pokemon-detail-section"
    );
    const sectionPokemonList = document.getElementById("pokemon-list-section");
    clearSection(sectionPokemonDetail);
    sectionPokemonDetail.innerHTML += constructPokemonDetailHtml(pokemon);
    const closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", onClickCloseButton);
    sectionPokemonDetail.classList.add(pokemon.types[0].type.name);
    sectionPokemonDetail.classList.remove("hidden");
    sectionPokemonList.setAttribute("hidden", true);
  });
}

function clearSection(section) {
  section.innerHTML = "";
}

function constructPokemonDetailHtml(pokemon) {
  return `
      <div class="detail-header">
      <svg id="close-button" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#ed333b" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
        <h1 class="name">${pokemon.name}</h1>
        <ol class="types">
          ${pokemon.types
            .map(
              (type) =>
                `<li class="type ${type.type.name}">${type.type.name}</li>`
            )
            .join("")}
        </ol>
      </div>
      <div class="detail-body">
        <div class="detail-image">
          <img src="${pokemon.sprites.other.dream_world.front_default}"/>
        </div>
        <div class="info">
          <div>
            <h2>About</h2>
          </div>
          <div>
            <table>
                <tr>
                  <td class="info-topics">Species</td> <td class="capitalize">${
                    pokemon.species.name
                  }</td>
                </tr>
                <tr>
                  <td class="info-topics">Height</td> <td>${
                    pokemon.height
                  }ft</td>
                </tr>
                <tr>
                  <td class="info-topics">Weight</td> <td>${
                    pokemon.weight
                  }lbs</td>
                </tr>
                <tr>
                  <td class="info-topics">Abilities</td>
                  <td>
                  ${pokemon.abilities
                    .map(
                      (ability) =>
                        `<span class="capitalize">${ability.ability.name}</span>`
                    )
                    .join(", ")}
                  </td>
                </tr>
            </table>
          </div>
          <div>
            <h3>Stats</h3>
            <table>
              ${pokemon.stats
                .map(
                  (stat) =>
                    `<tr><td class="info-topics">${stat.stat.name}</td> <td>${stat.base_stat}</td>`
                )
                .join("")}
            </table>
          </div>
        </div>
      </div>
    `;
}
