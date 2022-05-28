import './css/styles.css';
import { fetchCountries } from './fetchCountries'; 
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
let country;
const refs = {
    search: document.querySelector('#search-box'),
    countriesInfo: document.querySelector('.country-info'),
    countriesList: document.querySelector('.country-list'),
}
refs.search.addEventListener("input", debounce(inputSearch, DEBOUNCE_DELAY))

function clearData() {
    refs.countriesInfo.innerHTML = '';
    refs.countriesList.innerHTML = ''; 
}


function inputSearch(e) {
    const inputValue = e.target.value.trim();

    if (inputValue === '') {
        clearData();
        return;
    }

fetchCountries(inputValue)
    .then(countries => {
        if (countries.length > 10) {
            clearData();
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
            return;
        } else if (countries.length === 1) {
            clearData();
            renderCountry(countries[0]);
            return;
        }
        renderCountries(countries);
    }
    )
    .catch(error => {
        clearData();
        Notiflix.Notify.failure("Oops, there is no country with that name");
        return;
    });

    function renderCountry(country) {
        console.log(country);
    const countryMarkup = `
    <div class = "info">
    <img src = "${country.flags.svg}" alt = Flag of"${country.name}" class="flag"><h1>${country.name.official}</h1> 
    </div>
    <p><span>Capital:</span> ${country.capital}</p>
    <p><span>Population:</span> ${country.population}</p>
    <p><span>Languages:</span> ${Object.values(country.languages).join(',')}</p>`;
        refs.countriesInfo.innerHTML = countryMarkup;
}
function renderCountries(countries) {
    clearData();
   const markup = countries.map((country) => {
       return `<li>
        <img
         src = "${country.flags.svg}"
          alt = Flag of"${country.name.official}"
          />
        <span>${country.name.official}</span>
        </li>`
        
   }).join("");
    refs.countriesList.innerHTML = markup;
}
}
   
