"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import {
  ICountryStructure,
  IStateStructure,
  IWeatherWithDateStructure,
} from "@/types/ListTypes";
import { toast } from "react-toastify";
import { getISODateFormat } from "@/utils/Formatters";
import axiosInstance from "@/app/api/axios";

import { Input, Select, DynamicIcons, Button } from "./ui";
import { getAllCountries, getStatesByCountry } from "@/services/queries";
import { LocalStorageService } from "@/utils/LocalStorageService";

interface WeatherModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  modalOpen?: boolean;
}

/**
 * WeatherPredictionsByDate component allows users to search for weather forecasts
 * by country, state, and date range. It uses reusable UI components for inputs.
 */
export const WeatherPredictionsByDate = ({
  setModalOpen, modalOpen
}: WeatherModalProps) => {
  const [countries, setCountries] = useState<ICountryStructure[]>([]);
  const [states, setStates] = useState<IStateStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allConditions, setAllConditions] = useState<string[]>();
  const [clonedWeather, setCloneWeather] =
    useState<IWeatherWithDateStructure>();

  const defaultFormState = {
    startDate: "",
    endDate: "",
    country: "",
    state: "",
    weather: {} as IWeatherWithDateStructure,
  };

  const [form, setForm] = useState(defaultFormState);
  const [isDataFetching, setIsDataFetching] = useState(false);

  const { endDate, startDate, country, state } = form;

// Fetching countries from the API
const fetchCountries = async () => {
  setIsDataFetching(true);
  try {
    const countries = LocalStorageService.get<ICountryStructure[]>('countries') 
      ?? await getAllCountries();

    if (countries && countries.length > 0) {
      setCountries(countries);
      setForm((prev) => ({ ...prev, country: countries[0].name }));

      if (!LocalStorageService.get('countries')) {
        LocalStorageService.set(countries, 'countries');
      }
    }
  } finally {
    setIsDataFetching(false);
  }
};


  useEffect(() => {
    if(modalOpen){
      fetchCountries();
    }
  }, [modalOpen]);

  // Fetching states by country id
const fetchStates = async () => {
  setIsDataFetching(true);
  try {
    const selectedCountryId = countries.find((region) => region.name === country)?.id;

    if (!selectedCountryId) return;

    const states =
      LocalStorageService.get<IStateStructure[]>(`${selectedCountryId}`) ??
      await getStatesByCountry(selectedCountryId);

    if (states && states.length > 0) {
      setStates(states);
      setForm((prev) => ({ ...prev, state: states[0].name }));

      if (!LocalStorageService.get(`${selectedCountryId}`)) {
        LocalStorageService.set(states, `${selectedCountryId}`);
      }
    }
  } finally {
    setIsDataFetching(false);
  }
};


  useEffect(() => {
    if (country && modalOpen) {
      fetchStates();
    }
  }, [country, modalOpen]);

  const handleRequest = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    try {
      setIsLoading(true);
      const location =
        state && country ? `${state},${country}` : country || state || "";
      let url = `${location}`;

      url += `/${getISODateFormat(startDate)}/${getISODateFormat(endDate)}`;

      const res = await axiosInstance.get(
        `${url}?unitGroup=metric&key=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      if (res.data) {
        toast.success("Forecast fetched successfully!");
        setCloneWeather(res.data);
        setForm((prev) => ({ ...prev, weather: res.data }));
        setAllConditions(uniqueConditions(res.data.days));
      }
    } catch (err) {
      toast.error(
        (err as Error).message || "Failed to fetch weather forecast."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueConditions = (days: { conditions: string }[]) => {
    const all = days.map((d) => d.conditions);
    return Array.from(new Set(all));
  };

  const handleFiltering = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (!clonedWeather?.days) return;

    const filteredDays =
      selected === "all"
        ? clonedWeather.days
        : clonedWeather.days.filter((d) => d.conditions === selected);

    setForm((prev) => ({
      ...prev,
      weather: { ...prev.weather, days: filteredDays },
    }));
  };

  return (
    <div className="h-full flex items-center justify-center z-50 p-1">
      <div className="bg-white max-w-[600px] w-full mx-auto h-fit rounded-md p-1">
        <div className="bg- w-full max-h-[70vh] rounded-md relative overflow-y-scroll custom-scrollbar">
          {/* Modal Header */}
          <div
            className="flex items-center justify-between gap-6 border-b px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-[99999] bg-white"
            onClick={() => setModalOpen(false)}
          >
            <p className="text-theme-blue font-semibold text-base sm:text-lg">
              Find the right weather for your outing
            </p>

            <DynamicIcons
              iconName="iconoir:cancel"
              className="text-xl text-theme-blue cursor-pointer hover:text-red-600 bg-gray-200 rounded-full transition-all duration-300 ease-in-out"
            />
          </div>

          {
            isDataFetching ?
            <div className="w-full relative h-[40vh] flex items-center">
                <div className="loader w-full m-auto"></div>
            </div>
            :
            <form className="px-6 py-5">
              <div className="relative">
                <Select
                  label="Country"
                  data-testid="country"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, country: e.target.value }))
                  }
                  value={country}
                  options={countries.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                />
              </div>

              <div className="relative py-4">
                <Select
                  label="State"
                  data-testid="state"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, state: e.target.value }))
                  }
                  value={state}
                  options={
                    states.length > 0
                      ? states.map((s) => ({ value: s.name, label: s.name }))
                      : [{ value: "", label: "No State to select from" }]
                  }
                  disabled={states.length === 0}
                />
              </div>

              <div className="py-4">
                <div className="flex w-full gap-[20px] flex-wrap sm:flex-nowrap">
                  <Input
                    label="Start Date"
                    data-testid="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                  <Input
                    label="End Date"
                    data-testid="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center pt-3 justify-between">
                {form.weather.days?.length > 0 && (                
                    <div className="relative py-4">
                      <Select
                        label="Filter by"
                        data-testid="filter-condition"
                        onChange={handleFiltering}
                        options={[
                          { value: "all", label: "Show All" },
                          ...(allConditions?.map((condition) => ({
                            value: condition,
                            label: condition,
                          })) || []),
                        ]}
                      />
                    </div>
                  
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    data-testid="search-button"
                    onClick={handleRequest}
                    isLoading={isLoading}
                    iconName="proicons:search"
                  >
                    Search
                  </Button>
                </div>
              </div>

              <div className="py-6 flex flex-col gap-[20px]">
                {isLoading ? (
                  <div className="loader w-full m-auto"></div>
                ) : (
                  form.weather.days?.map((day, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-100 my-1 rounded-md shadow-lg p-4"
                    >
                      <p className="font-semibold text-theme-blue mb-2">
                        Date:{" "}
                        {day.datetime
                          ? new Date(day.datetime).toLocaleDateString("en-GB")
                          : ""}
                      </p>
                      <DynamicIcons
                        iconName={`wpf:${day.icon}`}
                        width={35}
                        height={35}
                        className="text-theme-orange"
                      />
                      <p>
                        Temperature: {day.temp}
                        <sup>o</sup>C
                      </p>
                      <p>Wind Speed: {day.windspeed} m/s</p>
                      <p>Description: {day.description}</p>
                    </div>
                  ))
                )}
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  );
};
