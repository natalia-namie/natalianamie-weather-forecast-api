const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  try {
    const result = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`);
    const data = await result.json();
    if (data.length === 0) {
      return alert('Nenhuma cidade encontrada');
    }
    return data;
  } catch (e) {
    window.alert('Nenhuma cidade encontrada');
  }
};

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
