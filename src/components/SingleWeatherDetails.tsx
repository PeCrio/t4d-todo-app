import React from 'react'
import DynamicIcons from './DynamicIcons';
import { IWeatherStructure, IWeatherWithDateStructure } from '@/types/ListTypes';

const SingleWeatherDetails = ({weather}: { weather: IWeatherStructure | IWeatherWithDateStructure | undefined}) => {
  return (
    <div>
        {weather && (
            <div
            key={weather.address}
            className="bg-white border border-gray-100 my-1 rounded-md shadow-lg p-4"
            >
            {"days" in weather ? (
                <div>
                <DynamicIcons
                    iconName={`wpf:${weather.days[0].icon}`}
                    width={35}
                    height={35}
                    className="text-theme-orange"
                />
                <p>
                    Temperature: {weather.days[0].temp}
                    <sup>o</sup>C
                </p>
                <p>
                    Wind Speed: {weather.days[0].windspeed} m/s
                </p>
                <p>
                    Description: {weather.days[0].description}
                </p>
                </div>
            ) : (
                <div>
                <DynamicIcons
                    iconName={`wpf:${weather.currentConditions.icon}`}
                    width={35}
                    height={35}
                    className="text-theme-orange"
                />
                <p>
                    Temperature: {weather.currentConditions.temp}
                    <sup>o</sup>C
                </p>
                <p>
                    Wind Speed:{" "}
                    {weather.currentConditions.windspeed} m/s
                </p>
                <p>Description: {weather.description}</p>
                </div>
            )}
            </div>
        )}
    </div>
  )
}

export default SingleWeatherDetails