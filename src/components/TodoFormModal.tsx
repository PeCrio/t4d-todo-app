"use client";

import {
  ICountryStructure,
  IListStructure,
  IStateStructure,
  IWeatherStructure,
  IWeatherWithDateStructure,
} from "@/types/ListTypes";
import { LocalStorageService } from "@/utils/LocalStorageService";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  useId,
  useEffect,
  useCallback,
} from "react";
import DynamicIcons from "./DynamicIcons";
import { toast } from "react-toastify";
import countriesDetails from "@/data/countries.json";
import Image from "next/image";
import axiosInstance from "@/api/axios";
import { getISODateFormat } from "@/utils/Formatters";
import SingleWeatherDetails from "./SingleWeatherDetails";
import DeletePrompt from "./DeletePrompt";

interface TodoFormModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setMode: Dispatch<SetStateAction<"add" | "edit" | "delete">>;
  todoItemId?: string | number;
  refreshTodoList: () => void;
  mode: "add" | "edit" | "delete";
}

const TodoFormModal = ({
  setModalOpen,
  todoItemId,
  refreshTodoList,
  mode,
}: TodoFormModalProps) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [subTaskLength, setSubTaskLength] = useState(1);
  const [countries, setCountries] = useState<ICountryStructure[]>([]);
  const [states, setStates] = useState<IStateStructure[]>([]);
  const [weather, setWeather] = useState<
    IWeatherStructure | IWeatherWithDateStructure
  >();

  const defaultFormState = {
    name: "",
    description: "",
    date: "",
    tag: "",
    hasSubTasks: false,
    subTasks: [""],
    isAnOutDoorEvent: false,
    country: "",
    state: "",
  };

  const [form, setForm] = useState(defaultFormState);

  const {
    name,
    description,
    date,
    tag,
    hasSubTasks,
    subTasks,
    isAnOutDoorEvent,
    country,
    state,
  } = form;

  const [isLoading, setIsLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const id = crypto.randomUUID();
  const domId = useId();

  const getStates = useCallback(() => {
    const filteredState = countries.find(
      (filteredCountry) => filteredCountry.name === country
    )?.states;
    setStates(filteredState as IStateStructure[]);
    setForm((prev) => ({ ...prev, state: filteredState?.[0]?.name || '' }));
  }, [countries, country])

  useEffect(() => {
    setCountries(countriesDetails as ICountryStructure[]);
    if (countries) {
      setForm((prev) => ({ ...prev, country: countries[0]?.name }));
    }
  }, [countries]);

  useEffect(() => {
    if (country) {
      getStates();
    }
  }, [country]);

  useEffect(() => {
    const preExistingData = LocalStorageService.get<IListStructure[]>();

    if (todoItemId) {
      const currentTodoItem = preExistingData?.find(
        (item) => item.id === todoItemId
      );
      if (currentTodoItem) {
        const isoDateFormat = currentTodoItem
          ? new Date(currentTodoItem?.date).toISOString().split("T")[0]
          : "";
        setSubTaskLength(currentTodoItem?.subTasks?.length ?? 1);
        setWeather(currentTodoItem.weather);
        setForm((prev) => ({
          ...prev,
          name: currentTodoItem?.name,
          completed: currentTodoItem?.completed,
          hasSubTasks: currentTodoItem?.has_subtask,
          subTasks: currentTodoItem?.subTasks ?? [""],
          description: currentTodoItem?.description,
          date: isoDateFormat,
          tag: currentTodoItem?.tag,
          isAnOutDoorEvent: !!currentTodoItem?.weather,
          country: countries.find((country)=> country.name === currentTodoItem.weather?.address.split(',')[1])?.name || '',
          state: states.find((state)=> state.name === currentTodoItem.weather?.address.split(',')[0])?.name || ''
        }));
      }
    }
  }, [todoItemId]);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const preExistingData = LocalStorageService.get<IListStructure[]>();
    const currentTodoItem = preExistingData?.find(
      (item) => item.id === todoItemId
    );

    if (!isFormValid) return;
    try {
      setIsLoading(true);
      const preExistingData = LocalStorageService.get<IListStructure[]>();
      const data = {
        name,
        description,
        date,
        tag,
        has_subtask: hasSubTasks,
        completed: todoItemId ? currentTodoItem?.completed : false,
        ...(hasSubTasks && { subTasks }),
        ...(form.isAnOutDoorEvent && weather ? { weather } : {})
      };

      if (todoItemId) {
        const updatedList = (preExistingData || []).map((item) =>
          item.id === todoItemId ? { ...item, ...data } : item
        );

        LocalStorageService.set(updatedList);
        toast.success("Successfully updated To-do item.");
      } else {
        const payload = {
          ...data,
          id,
        };

        LocalStorageService.set([...(preExistingData || []), payload]);
        toast.success("Successfully added To-do item.");
      }

      setModalOpen(false);
      setForm(defaultFormState);
      refreshTodoList();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const validSubTasks = form.subTasks
      .map((task) => task.trim())
      .filter(Boolean);
    setIsFormValid(
      (!form.hasSubTasks || validSubTasks.length > 0) &&
        form.date !== "" &&
        form.name.trim() !== ""
        ? true
        : false
    );
  }, [form.name, form.date, form.hasSubTasks, form.subTasks]);

  const addSubTasks = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = event.target.value;
    setForm((prev) => ({ ...prev, subTasks: newSubTasks }));
  };

  const removeSubTask = (index: number) => {
    subTasks.splice(index, 1);
    setSubTaskLength((prev) => prev - 1);

    if (subTaskLength == 1) {
      setForm((prev) => ({ ...prev, hasSubTasks: false }));
    }
  };

  const handleDelete = () => {
    if (todoItemId) {
      try {
        const lists = LocalStorageService.get<IListStructure[]>() || [];
        const updatedLists = lists.filter((list) => list.id !== todoItemId);
        LocalStorageService.set(updatedLists);
        refreshTodoList();
        toast.info("To-do item has been successfully deleted!");
      } catch (err) {
        toast.error(
          (err as Error).message || "To-do item could not be deleted!"
        );
      }
    }
  };

  const getWeatherForeCast = async () => {
    try {
        setIsWeatherLoading(true);
      const location =
        state && country ? `${state},${country}` : country || state || "";
        const date = form.date ? getISODateFormat(form.date) : '';
      const res = await axiosInstance.get(
        `${location}/${date}?unitGroup=metric&key=${
          process.env.NEXT_PUBLIC_API_KEY
        }`
      );
      setWeather(res.data);
    } catch (err) {
      toast.error((err as Error).message || "Something went wrong");
    } finally{
        setIsWeatherLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center z-50">
      <div
        className={`max-w-[600px] ${
          mode !== "delete" ? "w-full" : ""
        } relative mx-auto`}
      >
        <div
          className={`-top-[20px] -right-[40px] absolute`}
          onClick={() => setModalOpen(false)}
        >
          <DynamicIcons iconName="iconoir:cancel" className="text-[28px] text-theme-blue cursor-pointer bg-white rounded-full" />
        </div>

        {(mode === "add" || mode === "edit") && (
          <div className="bg-white w-full max-h-[70vh] rounded-md relative overflow-scroll">
            <p className="text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white">
              {`${mode === "edit" ? "Edit" : "Add"} Todo List`}{" "}
            </p>
            <form className="p-6 custom-scrollbar2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-[20px]">
                <div className="w-full flex flex-col">
                  <span className="pb-1">
                    Name<span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter Name"
                    className="inputDiv rounded-md"
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="w-full flex flex-col">
                  <span className="pb-1">Description</span>
                  <textarea
                    rows={4}
                    value={description}
                    placeholder="Enter Description"
                    className="inputDiv rounded-md"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
                <div className="flex gap-[20px] w-full">
                  <div className="flex flex-col w-full">
                    <span>
                      Due Date<span className="text-red-500">*</span>
                    </span>
                    <input
                      type="date"
                      value={date}
                      className="inputDiv rounded-md"
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <span>Tag</span>
                    <input
                      type="text"
                      value={tag}
                      className="inputDiv rounded-md"
                      placeholder="Enter Tag"
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, tag: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-[5px]">
                    <div className="flex items-center gap-[5px]">
                      <input
                        type="checkbox"
                        className="rounded-md"
                        checked={hasSubTasks}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            hasSubTasks: e.target.checked,
                          }))
                        }
                        id={`subtask-${domId}`}
                        name="subtask"
                      />
                      <label
                        className="text-[15px] cursor-pointer"
                        htmlFor={`subtask-${domId}`}
                      >
                        Has Subtasks?{" "}
                        {hasSubTasks && <span className="text-red-500">*</span>}
                      </label>
                    </div>
                    {hasSubTasks && (
                      <div
                        className="flex gap-[3px] items-center bg-theme-blue text-white rounded-md px-4 py-2 w-fit cursor-pointer"
                        onClick={() => {
                          setSubTaskLength((prev) => prev + 1);
                          setForm((prev) => ({
                            ...prev,
                            subTasks: [...prev.subTasks, ""],
                          }));
                        }}
                      >
                        <DynamicIcons iconName="gridicons:plus" width={15} height={15} />
                      </div>
                    )}
                  </div>
                  <>
                    {hasSubTasks && subTaskLength > 0 ? (
                      Array.from({ length: subTaskLength }).map((_, index) => (
                        <div
                          key={index}
                          className="flex gap-[10px] flex-col py-2"
                        >
                          <div className="flex items-center gap-[10px]">
                            <input
                              type="text"
                              value={subTasks[index]}
                              className="inputDiv w-full rounded-md"
                              placeholder="Enter SubTask"
                              onChange={(e) => addSubTasks(index, e)}
                            />
                            <div
                              className="flex gap-[3px] items-center bg-theme-blue text-white rounded-md px-4 py-2 w-fit cursor-pointer"
                              onClick={() => removeSubTask(index)}
                            >
                                <DynamicIcons iconName="cil:minus" width={18} height={18} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </>
                  <div className="flex items-center gap-[5px] pt-2">
                    <input
                      type="checkbox"
                      className="rounded-md"
                      checked={isAnOutDoorEvent}
                      name="isAnOutDoorEvent"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isAnOutDoorEvent: e.target.checked,
                        }))
                      }
                      id={`outdoor-${domId}`}
                    />
                    <label
                      className="text-[15px] cursor-pointer"
                      htmlFor={`outdoor-${domId}`}
                    >
                      Is this an outdoor event
                    </label>
                  </div>
                  <div className="py-4">
                    {(isAnOutDoorEvent || weather) && (
                      <>
                        <div className="relative">
                          <select
                            className="border border-theme-blue rounded-md p-2 outline-none w-full"
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                country: e.target.value,
                              }))
                            }
                            value={form.country}
                          >
                            {countries.map((country) => (
                              <option key={country.id}>{country.name}</option>
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
                        <div className="relative py-4">
                          <select
                            className="border border-theme-blue rounded-md p-2 outline-none w-full"
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            value={form.state}
                          >
                            {states?.length > 0 ? (
                              states.map((state) => (
                                <option key={state.id}>{state.name}</option>
                              ))
                            ) : (
                              <option>No State to select from</option>
                            )}
                          </select>
                          <Image
                            src="/images/arrow-down.png"
                            alt=""
                            height={20}
                            width={20}
                            className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                          />
                        </div>
                        <SingleWeatherDetails weather={weather}/>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[12px]">
                (N:B: You have to fill all required{" "}
                <span className="text-red-500">*</span> field to submit)
              </span>
              <div className="pt-4 flex gap-[20px] justify-end">
                {isAnOutDoorEvent && (
                  <div className="" onClick={()=>getWeatherForeCast()}>
                    <button type="button"
                      className={`px-4 py-2 rounded-md text-white text-[14px] bg-theme-blue cursor-pointer`}
                    >
                      {isWeatherLoading ? "Loading..." : "See Forecast"}
                    </button>
                  </div>
                )}
                <div className="">
                  <button
                    className={`px-4 py-2 rounded-md text-white text-[14px] ${
                      isFormValid
                        ? "bg-theme-blue cursor-pointer"
                        : "bg-[#cac9c9] cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? "Loading..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {mode === "delete" && <DeletePrompt isLoading={isLoading} handleDelete={handleDelete} />}
      </div>
    </div>
  );
};

export default TodoFormModal;
