import Notiflix from 'notiflix';
import './css/styles.css';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
}



const fetchCountries= (name) => {
    const nameEl = name.target.value.trim();
    

    fetch(`https://restcountries.com/v2/name/${nameEl}?fields=name,capital,population,flags,languages`).then(response => {
        if (!response.ok) {
            Notiflix.Notify.warning('Oops, there is no country with that name');
            noRequest()
        }
        return response.json();
    })
  
    .then(countries => {

        if (!countries.length) {
             noRequest()
        return
        }
        else if (countries.length === 1) {
            showOneCountry(countries)
           return

        }     
        else if (countries.length > 10) {  
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                  noRequest()
            return
        }   
         else if (countries.length >= 2) {
             showCountriesList(countries)
        }

    })

}

const noRequest  = () => {
    refs.countryList.innerHTML = ''
};

const showCountriesList = (countries) => {
    const markup = countries.map(({ name, flags }) => {
        return `<li class= 'country-list_item'>
        <img src=${flags.svg} alt=${name} class='country-list_flag' width = 100/>
        <p class'country-list_name' >${name} </p>
        </li>`
    }).join("")
    
    refs.countryList.innerHTML = markup
};

const showOneCountry = (countries) => {
    const markup = countries.map(({ name, capital, population, flags, languages }) => {
        const lang = languages.map(({ name }) => {
            return name
        })
        
        return `<div class = 'header' >
        <img src=${flags.svg} alt=${name} class='country_flag' height = 40/>
        <h1 class= 'country_name'>${name}</h1>
        </div>

        <ul class= 'country_info' >
        <li> <span class='country_info_comment' >Capital:</span> ${capital} </li>
        <li> <span class='country_info_comment'>Population:</span> ${population} </li>
        <li> <span class='country_info_comment'>Language:</span> ${lang} </li>
        </ul>`
  
    }).join("")
    refs.countryList.innerHTML = markup
    
};

    
refs.input.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));



