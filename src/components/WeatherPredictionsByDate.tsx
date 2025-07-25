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

  const { endDate, startDate, country, state } = form;

  // Get all countries from the API
  const fetchCountries = async () =>{
    const countriesData = await getAllCountries();
    setCountries(countriesData);
    if (countriesData.length > 0) {
      setForm((prev) => ({
        ...prev,
        country: countriesData[0]?.name || "",
      }));
    }
  }

  useEffect(() => {
    if(modalOpen){
      fetchCountries();
    }
  }, [modalOpen]);

  // Get all states by country id from the API
  const fetchStates = async () => {
    const selectedCountryId = countries.find((c) => c.name === country)?.id;
    const allStates = await getStatesByCountry(selectedCountryId as number);
    setStates(allStates);
    if(allStates){
      setForm((prev) => ({ ...prev, state: allStates?.[0]?.name || "" }));
    }
  }

  useEffect(() => {
    if (country) {
      fetchStates();
    }
  }, [country]);

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
    <div className="h-full flex items-center justify-center z-50">
      <div className="max-w-[600px] w-full relative mx-auto">
        <div className="bg-white w-full max-h-[70vh] rounded-md relative overflow-scroll">
          <div
            className="flex justify-end pt-2"
            onClick={() => setModalOpen(false)}
          >
            <DynamicIcons
              iconName="iconoir:cancel"
              className="text-[28px] text-theme-blue cursor-pointer bg-white rounded-full"
            />
          </div>
          <p className="text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white z-[2]">
            Find the right weather for your outing
          </p>

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
        </div>
      </div>
    </div>
  );
};
