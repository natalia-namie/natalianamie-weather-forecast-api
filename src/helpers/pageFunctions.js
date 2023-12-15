import { searchCities, getWeatherByCity } from './weatherAPI';

const TOKEN = import.meta.env.VITE_TOKEN;

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export function createCityElement(cityInfo) { // Listar cidades retornadas pela API
  const { name, country, temp, condition, icon, url } = cityInfo;

  const cityElement = createElement('li', 'city');

  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');

  const btnCheckWeather = createElement('button', 'city-forecast-button', 'Ver previsão'); // Criar botão

  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);

  cityElement.appendChild(btnCheckWeather); // Adicionar botão dentro de cityElement

  btnCheckWeather.addEventListener('click', async () => {
    const result = await fetch(`http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${url}&days=7`);
    const data = await result.json();
    const forecastData = data.forecast.forecastday.map((info) => { // Ao clicar no btn retorna essas informações
      return {
        date: info.date,
        maxTemp: info.day.maxtemp_c,
        minTemp: info.day.mintemp_c,
        condition: info.day.condition.text,
        icon: info.day.condition.icon,
      };
    });
    showForecast(forecastData);
  });

  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export const handleSearch = async (event) => {
  event.preventDefault();
  clearChildrenById('cities');

  const allCities = document.getElementById('cities'); // obter a ul #cities para adicionar as cidades.
  const searchInput = document.getElementById('search-input'); // onde o usuário insere o nome da cidade para pesquisar.
  const searchValue = searchInput.value; // obtém o valor do texto digitado pelo usuário.

  const cities = await searchCities(searchValue); // passa o valor da pesquisa e retorna uma promessa.

  const weatherData = await Promise.all(
    cities
      .map((city) => getWeatherByCity(city.url)), // itera sobre a lista de cidades e chama a função.
  )
    .then((city) => city.forEach((cityWeather) => { // Após as promessas resolvidas, then acesa o resultado.
      const cityElement = createCityElement(cityWeather); // passar os dados do clima para a função que cria o HTML.
      allCities.appendChild(cityElement); // adiciona os dados do clima ao <ul> cities para exibir a cidade na lista de cidades.
    }));
  return weatherData;
};
