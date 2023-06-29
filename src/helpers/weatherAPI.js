const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  try {
    const result = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`);
    const data = await result.json();
    if (data.length === 0) {
      alert('Nenhuma cidade encontrada');
      return [];
    }
    return data;
  } catch (e) {
    window.alert('Nenhuma cidade encontrada');
    return [];
  }
};

export const getWeatherByCity = async (cityURL) => {
  try {
    const result = await fetch(`http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${cityURL}`);
    const data = await result.json();

    return {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      url: `${cityURL}`,
    };
  } catch (error) {
    window.alert('Erro ao obter dados meteorológicos:');
    throw error;
  }
};
