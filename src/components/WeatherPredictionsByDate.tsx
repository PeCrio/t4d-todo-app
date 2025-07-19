"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import DynamicIcons from "./DynamicIcons";
import Image from "next/image";
import countriesDetails from "@/data/countries.json";
import {
  ICountryStructure,
  IStateStructure,
  IWeatherWithDateStructure,
} from "@/types/ListTypes";
import { toast } from "react-toastify";
import { getISODateFormat } from "@/utils/Formatters";
import axiosInstance from "@/api/axios";

interface WeatherModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const WeatherPredictionsByDate = ({ setModalOpen }: WeatherModalProps) => {
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

  const getStates = useCallback(() => {
    const filteredState = countries.find((c) => c.name === country)?.states;
    setStates(filteredState || []);
    setForm((prev) => ({ ...prev, state: filteredState?.[0]?.name || "" }));
  }, [countries, country]);

  useEffect(() => {
    setCountries(countriesDetails as ICountryStructure[]);
    if (countries.length > 0) {
      setForm((prev) => ({ ...prev, country: countries[0]?.name || "" }));
    }
  }, [countries]);

  useEffect(() => {
    if (country) getStates();
  }, [country, getStates]);

  const handleRequest = async () => {
    try {
      setIsLoading(true);
      const location =
        state && country ? `${state},${country}` : country || state || "";
      let url = `${location}`;

      if (startDate && endDate) {
        url += `/${getISODateFormat(startDate)}/${getISODateFormat(endDate)}`;
      } else if (startDate) {
        url += `/${getISODateFormat(startDate)}`;
      } else if (endDate) {
        url += `/null/${getISODateFormat(endDate)}`;
      }

      const res = await axiosInstance.get(
        `${url}?unitGroup=metric&key=${process.env.NEXT_PUBLIC_API_KEY}`
      );

      if (res.data) {
        toast.success("Forecast fetched Success");
        setCloneWeather(res.data);
        setForm((prev) => ({ ...prev, weather: res.data }));
        setAllConditions(uniqueConditions(res.data.days));
      }
    } catch (err) {
      toast.error((err as Error).message);
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
        <div
          className="top-[15px] z-[10] sm:-top-[20px] right-[20px] sm:-right-[40px] absolute"
          onClick={() => setModalOpen(false)}
        >
          <DynamicIcons
            iconName="iconoir:cancel"
            className="text-[28px] text-theme-blue cursor-pointer bg-white rounded-full"
          />
        </div>

        <div className="bg-white w-full max-h-[70vh] rounded-md relative overflow-scroll">
          <p className="text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white z-[2]">
            Find the right weather for your outing
          </p>

          <form className="px-6 py-5">
            <div className="relative">
              <p>Country</p>
              <select
                data-testid="country"
                className="border border-theme-blue rounded-md p-2 outline-none w-full"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
                value={country}
              >
                {countries.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
              <Image
                src="/images/arrow-down.png"
                alt=""
                height={20}
                width={20}
                className="pointer-events-none absolute right-3 top-[45px] transform -translate-y-1/2 w-4 h-4"
              />
            </div>

            <div className="relative py-4">
              <p>State</p>
              <select
                data-testid="state"
                className="border border-theme-blue rounded-md p-2 outline-none w-full"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, state: e.target.value }))
                }
                value={state}
              >
                {states?.length > 0 ? (
                  states.map((s) => <option key={s.id}>{s.name}</option>)
                ) : (
                  <option>No State to select from</option>
                )}
              </select>
              <Image
                src="/images/arrow-down.png"
                alt=""
                height={20}
                width={20}
                className="pointer-events-none absolute right-3 top-[60px] transform -translate-y-1/2 w-4 h-4"
              />
            </div>

            <div className="py-4">
              <div className="flex w-full gap-[20px] flex-wrap sm:flex-nowrap">
                <div className="flex flex-col gap-[5px] w-full">
                  <span>
                    Start Date<span className="text-red-500">*</span>
                  </span>
                  <input
                    data-testid="start-date"
                    type="date"
                    value={startDate}
                    className="inputDiv rounded-md"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-[5px] w-full">
                  <span>
                    End Date<span className="text-red-500">*</span>
                  </span>
                  <input
                    data-testid="end-date"
                    type="date"
                    value={endDate}
                    className="inputDiv rounded-md"
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center pt-3 justify-between gap-[20px] flex-wrap sm:flex-nowrap">
              {form.weather.days?.length > 0 && (
                <div className="flex gap-[5px] items-center relative w-fit">
                  <p>Filter By:</p>
                  <select
                    data-testid="filter-condition"
                    className="border border-theme-blue rounded-md outline-none py-1 px-2 w-[200px]"
                    onChange={handleFiltering}
                  >
                    <option value="all">Show All</option>
                    {allConditions?.map((condition) => (
                      <option key={condition}>{condition}</option>
                    ))}
                  </select>
                  <Image
                    src="/images/arrow-down.png"
                    alt=""
                    height={20}
                    width={20}
                    className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  data-testid="search-button"
                  className="bg-theme-blue flex items-center gap-[5px] text-[14px] py-2 w-fit px-4 text-white rounded-sm self-end cursor-pointer"
                  onClick={handleRequest}
                >
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <span>
                        <DynamicIcons iconName="proicons:search" />
                      </span>
                      <span>Search</span>
                    </>
                  )}
                </button>
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

export default WeatherPredictionsByDate;
