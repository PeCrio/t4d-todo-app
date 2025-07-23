
"use client";

import React from "react";
import { Button, CheckboxToggle, Select } from "./ui";
import SingleWeatherDetails from "./SingleWeatherDetails";

import { OutdoorEventWeatherProps } from "@/types/WeatherTypes";

export const OutdoorEventWeather = ({
  isAnOutDoorEvent,
  setIsAnOutDoorEvent,
  domId,
  countries,
  states,
  country,
  state,
  setForm,
  weather,
  getWeatherForeCast,
  isWeatherLoading,
}: OutdoorEventWeatherProps) => {
  return (
    <div className="py-4">
      <CheckboxToggle
        label="Is this an outdoor event"
        id={`outdoor-${domId}`}
        checked={isAnOutDoorEvent}
        onChange={(e) => setIsAnOutDoorEvent(e.target.checked)}
        name="isAnOutDoorEvent"
      />

      {(isAnOutDoorEvent || weather) && (
        <>
          <Select
            label="Country"
            value={country}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, country: e.target.value }))
            }
            options={countries.map((c) => ({ value: c.name, label: c.name }))}
          />
          <div className="relative py-4">
            <Select
              label="State"
              value={state}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, state: e.target.value }))
              }
              options={
                states.length > 0
                  ? states.map((s) => ({ value: s.name, label: s.name }))
                  : [{ value: "", label: "No State to select from" }]
              }
              disabled={states.length === 0}
            />
          </div>
          <SingleWeatherDetails weather={weather} />
          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={getWeatherForeCast}
              isLoading={isWeatherLoading}
            >
              See Forecast
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
