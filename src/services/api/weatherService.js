class WeatherService {
  async getCurrentWeather() {
    await this.delay()
    return {
      current: {
        location: "Farm Location",
        temperature: 72,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 8,
        windDirection: "NE"
      },
      forecast: [
        { day: "Today", high: 75, low: 58, condition: "sunny" },
        { day: "Tomorrow", high: 73, low: 55, condition: "cloudy" },
        { day: "Wed", high: 71, low: 53, condition: "rainy" },
        { day: "Thu", high: 69, low: 51, condition: "sunny" },
        { day: "Fri", high: 72, low: 54, condition: "partly-cloudy" }
      ]
    }
  }

  async getExtendedForecast() {
    await this.delay()
    return [
      { day: "Mon", high: 75, low: 58, condition: "sunny", precipitation: 0 },
      { day: "Tue", high: 73, low: 55, condition: "cloudy", precipitation: 10 },
      { day: "Wed", high: 71, low: 53, condition: "rainy", precipitation: 80 },
      { day: "Thu", high: 69, low: 51, condition: "sunny", precipitation: 0 },
      { day: "Fri", high: 72, low: 54, condition: "partly-cloudy", precipitation: 20 },
      { day: "Sat", high: 74, low: 56, condition: "sunny", precipitation: 0 },
      { day: "Sun", high: 76, low: 59, condition: "cloudy", precipitation: 30 },
      { day: "Mon", high: 78, low: 62, condition: "sunny", precipitation: 0 },
      { day: "Tue", high: 75, low: 58, condition: "partly-cloudy", precipitation: 15 },
      { day: "Wed", high: 73, low: 55, condition: "rainy", precipitation: 70 }
    ]
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 400))
  }
}

export default new WeatherService()