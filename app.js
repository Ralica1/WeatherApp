class Weather {
  constructor() {
    this.form = document.querySelector('form');
    this.locationInput = document.querySelector('#location');
    this.unitInput = document.querySelector('#unit');
    this.weatherInfo = document.querySelector('#weather-info');
    this.loading = document.createElement('div');
    this.loading.innerHTML = 'Loading...';
    this.loading.classList.add('loading');
  }

  async getWeatherData(location, unit) {
    const apiKey = '38da7deff236bff1f6f905103d5c33da';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    if (unit === 'Fahrenheit') {
      apiUrl = apiUrl + '&units=imperial';
    } else {
      apiUrl = apiUrl + '&units=metric';
    }
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  extractWeatherData(data) {
    let temperature = data.main.temp; 
    const description = data.weather[0].description;
    const city = data.name;
    return { temperature, description, city };
  }

  async submitForm() {
    try {
      this.weatherInfo.appendChild(this.loading);
      const location = this.locationInput.value;
      const unit = this.unitInput.value;
      const data = await this.getWeatherData(location, unit);
      const weatherData = this.extractWeatherData(data);
      this.weatherInfo.innerHTML = `
        <p>Temperature: ${weatherData.temperature} ${unit}</p>
        <p>Description: ${weatherData.description}</p>
        <p>City: ${weatherData.city}</p>
      `;
    } catch (error) {
      console.error(error);
    } finally {
      this.weatherInfo.removeChild(this.loading);
    }
  }

  init() {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.submitForm();
    });

    window.onload = () => {
      this.submitForm();
    };
  }
}

const weather = new Weather();
weather.init();

const themeButton = document.querySelector('#switch-theme-button');

// Event listener for theme button
themeButton.addEventListener('click', (e) => {
  document.body.classList.toggle('dark-theme');
  if (document.body.classList.contains('dark-theme')) {
    themeButton.innerHTML = 'Light Theme';
  } else {
    themeButton.innerHTML = 'Dark Theme';
  }
});