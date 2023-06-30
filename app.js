const pokemonList = document.querySelector("#pokemon-list");
const paginationList = document.querySelector(".pagination");
const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const limitParameter = "limit=";
const offsetParameter = "offset=";
const pokemonsPerPage = 10;
const rangeSize = 5;
const offsetValue = 0;

let currentPage = 1;
let rangeStart = rangeSize - 4;
let rangeEnd = rangeSize;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function createPaginationList() {
  paginationList.innerHTML = "";
  const { count: totalPokemons } = await fetchData(apiUrl);
  const totalPages = totalPokemons / pokemonsPerPage;
  
  if (currentPage > 1) {
    createPaginationItem("<");
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    createPaginationItem(i);
  }
  
  if (currentPage < totalPages) {
    createPaginationItem(">");
  }

  const pagesItems = document.querySelectorAll(".pagination-item");
  pagesItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      resetClassPages();
      changePage(item);
    });
  });
}

function createPaginationItem(text) {
  const liPagination = document.createElement("li");
  liPagination.textContent = text;
  liPagination.classList.add("pagination-item");

  if(parseInt(text) === currentPage){
    liPagination.classList.add("page-active");
  }
  
  paginationList.appendChild(liPagination);
}

function changePage(item) {
  const liText = item.innerText;
  
  if (liText === "<") {
    currentPage -= 1;
  } else if (liText === ">") {
    currentPage += 1;
  } else {
    currentPage = parseInt(liText);
  }
  
  if (currentPage === rangeEnd) {
    rangeStart += 1;
    rangeEnd += 1;
  } else if (currentPage === rangeStart && currentPage != 1) {
    rangeStart -= 1;
    rangeEnd -= 1;
  }
  createPaginationList();
  createPokemonList((currentPage - 1) * pokemonsPerPage);
}

function resetClassPages() {
  const paginationItems = document.querySelectorAll(".pagination-item");
  paginationItems.forEach((item) => item.classList.remove("page-active"));
}

function createPokemonsListItem(img, name) {
  const pokemonItem = document.createElement("li");
  const pokemonImage = document.createElement("img");
  const pokemonName = document.createElement("p");
  pokemonItem.setAttribute("class", "pokemon-card");
  pokemonImage.setAttribute("src", img === null ? "./img/404.jpg" : img);
  pokemonName.textContent = name;
  pokemonItem.appendChild(pokemonImage);
  pokemonItem.appendChild(pokemonName);
  pokemonList.appendChild(pokemonItem);
}

async function createPokemonList(offset) {
  pokemonList.innerHTML = "";
  const { results: pokemons } = await fetchData(
    apiUrl +
    "?" +
    limitParameter +
      pokemonsPerPage +
      "&" +
      offsetParameter +
      offset
  );
  pokemons.forEach(async (p) => {
    try {
      const pokemon = await fetchData(p.url);
      createPokemonsListItem(
        pokemon.sprites.other.dream_world.front_default,
        pokemon.name
      );
    }
    catch (error) {
      createPokemonsListItem("./img/404.jpg", "Not found");
    }
  });
}

function searchPokemon(){
  const searcherPokemon = document.querySelector("#search-pokemon");
  searcherPokemon.addEventListener("keypress", async (e)=>{
    if (e.key === "Enter"){
      const res = await fetchData(apiUrl + '/' + searcherPokemon.value);
      console.log(res);
    }
  })
}

function showDetails(){
  const pokemonCard = document.querySelectorAll(".pokemon-card");
  pokemonCard.addEventListener("click", (e)=>console.log(e))
}

createPaginationList();

createPokemonList(offsetValue);

searchPokemon();

showDetails();