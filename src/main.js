import { handleSearch } from './helpers/pageFunctions';

document.getElementById('search-form')
  .addEventListener('submit', handleSearch);

document.getElementById('close-forecast')
  .addEventListener('click', () => {
    document.getElementById('forecast-container').classList.add('hidden');
  });
