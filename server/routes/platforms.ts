import { RequestHandler } from "express";
import { PlatformData, MOCK_PLATFORMS } from "@shared/api";

const QUINCY_ZIP = "62301";
const API_KEY = process.env.VITE_OPENWEATHER_API_KEY;

async function getQuincyWeather() {
  if (!API_KEY || API_KEY === 'your_key_here') return null;
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${QUINCY_ZIP},us&appid=${API_KEY}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
}

export const handleGetPlatforms: RequestHandler = async (_req, res) => {
  // Logic for Quincy, IL (62301) - CST Time
  const now = new Date();
  const cstOffset = -6; // Central Standard Time
  const hour = (now.getUTCHours() + cstOffset + 24) % 24;
  const day = now.getUTCDay(); // 0 = Sunday

  const weatherData = await getQuincyWeather();
  let weatherMultiplier = 1.0;

  // Weather Logic: Rain, Snow, or Extreme Cold boosts demand
  if (weatherData) {
    const mainWeather = weatherData.weather?.[0]?.main?.toLowerCase();
    if (mainWeather === 'rain' || mainWeather === 'drizzle') {
      weatherMultiplier = 1.25; // 25% boost for rain
    } else if (mainWeather === 'snow') {
      weatherMultiplier = 1.4; // 40% boost for snow
    } else if (mainWeather === 'thunderstorm') {
      weatherMultiplier = 1.35;
    }
  }

  const dynamicPlatforms = MOCK_PLATFORMS.map(platform => {
    let timeMultiplier = 1.0;
    let status: PlatformData['status'] = 'normal';
    let topLocation = platform.topLocation;

    // QUINCY LOGIC ENGINE
    if (platform.id === 'spark') {
      if (hour >= 7 && hour <= 11) {
        timeMultiplier = 1.4;
        status = 'peak';
        topLocation = "Walmart (52nd & Broadway)";
      } else if (day === 0 || day === 6) {
        timeMultiplier = 1.2;
        status = 'peak';
      }
    }

    if (platform.id === 'doordash') {
      if ((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 20)) {
        timeMultiplier = 1.5;
        status = 'peak';
        topLocation = "Broadway Corridor";
      }
    }

    if (platform.id === 'ubereats') {
      if (hour >= 18 && hour <= 22) {
        timeMultiplier = 1.3;
        status = 'peak';
        topLocation = "Downtown / QU Area";
      }
    }

    // Combine Weather and Time multipliers
    const finalMultiplier = timeMultiplier * weatherMultiplier;
    const currentEarnings = Number((platform.currentEarnings * finalMultiplier).toFixed(2));
    
    // Set status to peak if either weather or time is boosting
    const finalStatus = finalMultiplier > 1.2 ? 'peak' : status;

    return {
      ...platform,
      currentEarnings,
      status: finalStatus,
      topLocation,
      orders: Math.floor(platform.orders * finalMultiplier)
    };
  });

  dynamicPlatforms.sort((a, b) => b.currentEarnings - a.currentEarnings);
  res.json(dynamicPlatforms);
};
