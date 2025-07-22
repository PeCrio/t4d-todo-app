
"use client";

import {
  ICountryStructure,
  IListStructure,
  IStateStructure,
  IWeatherStructure,
  IWeatherWithDateStructure,
} from "@/types/ListTypes";
import { LocalStorageService } from "@/utils/LocalStorageService";
import {
  useState,
  Dispatch,
  SetStateAction,
  useId,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import countriesDetailsRaw from "@/data/countries.json";
import axiosInstance from "@/api/axios";
import { getISODateFormat } from "@/utils/Formatters";
import DeletePrompt from "./DeletePrompt";

import { Button } from "./ui/Button";
import { DynamicIcons } from "./ui/DynamicIcons";
import { TodoForm } from "./TodoForm";
import { OutdoorEventWeather } from "./OutdoorEventWeather";

interface TodoFormModalProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setMode: Dispatch<SetStateAction<"add" | "edit" | "delete">>;
  todoItemId?: string | number;
  refreshTodoList: () => void;
  mode: "add" | "edit" | "delete";
}

export const TodoFormModal = ({
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
    IWeatherStructure | IWeatherWithDateStructure | undefined
  >();

  const defaultFormState = {
    name: "",
    description: "",
    date: "",
    tag: "",
    hasSubTasks: false,
    subTasks: [""] as string[],
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
  const countriesDetails = countriesDetailsRaw as ICountryStructure[];

  const id = crypto.randomUUID();
  const domId = useId();

  useEffect(() => {
    setCountries(countriesDetails as ICountryStructure[]);
    if (countriesDetails.length > 0 && form.country === "") {
      setForm((prev) => ({ ...prev, country: countriesDetails[0]?.name || "" }));
    }
  }, []);

  const getStates = useCallback(() => {
    const filteredState = countries.find(
      (filteredCountry) => filteredCountry.name === country
    )?.states;
    setStates(filteredState || []);
    setForm((prev) => ({ ...prev, state: filteredState?.[0]?.name || "" }));
  }, [countries, country]);

  useEffect(() => {
    if (country) {
      getStates();
    }
  }, [country, getStates]);

  useEffect(() => {
    const preExistingData = LocalStorageService.get<IListStructure[]>();

    if (todoItemId && preExistingData) {
      const currentTodoItem = preExistingData.find(
        (item) => item.id === todoItemId
      );
      if (currentTodoItem) {
        const isoDateFormat = currentTodoItem.date
          ? new Date(currentTodoItem.date).toISOString().split("T")[0]
          : "";
        setSubTaskLength(currentTodoItem.subTasks?.length ?? 1);
        setWeather(currentTodoItem.weather);

        const weatherAddressParts = currentTodoItem.weather?.address?.split(',');
        const weatherStateName = weatherAddressParts?.[0]?.trim() || '';
        const weatherCountryName = weatherAddressParts?.[1]?.trim() || '';

        const initialCountry = countries.find(c => c.name === weatherCountryName)?.name || '';
        const initialStatesForCountry = countries.find(c => c.name === initialCountry)?.states || [];
        const initialState = initialStatesForCountry.find(s => s.name === weatherStateName)?.name || '';

        setForm((prev) => ({
          ...prev,
          name: currentTodoItem.name,
          completed: currentTodoItem.completed,
          hasSubTasks: currentTodoItem.has_subtask,
          subTasks: currentTodoItem.subTasks ?? [""],
          description: currentTodoItem.description,
          date: isoDateFormat,
          tag: currentTodoItem.tag,
          isAnOutDoorEvent: !!currentTodoItem.weather,
          country: initialCountry,
          state: initialState,
        }));
      }
    }
  }, [todoItemId, countries, states]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      const preExistingData = LocalStorageService.get<IListStructure[]>() || [];
      const currentTodoItem = preExistingData.find(
        (item) => item.id === todoItemId
      );

      const data = {
        name,
        description,
        date,
        tag,
        has_subtask: hasSubTasks,
        completed: todoItemId ? currentTodoItem?.completed : false,
        ...(hasSubTasks && { subTasks: subTasks.filter(Boolean) }),
        ...(isAnOutDoorEvent && weather ? { weather } : {}),
      };

      if (todoItemId) {
        const updatedList = preExistingData.map((item) =>
          item.id === todoItemId ? { ...item, ...data } : item
        );
        LocalStorageService.set(updatedList);
        toast.success("Successfully updated To-do item.");
      } else {
        const payload = {
          ...data,
          id,
        } as IListStructure;

        LocalStorageService.set([...preExistingData, payload]);
        toast.success("Successfully added To-do item.");
      }

      setModalOpen(false);
      setForm(defaultFormState);
      refreshTodoList();
    } catch (e) {
      toast.error((e as Error).message || "An error occurred.");
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
      form.date.trim() !== "" &&
      form.name.trim() !== ""
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
    const newSubTasks = [...subTasks];
    newSubTasks.splice(index, 1);
    setForm((prev) => ({ ...prev, subTasks: newSubTasks }));
    setSubTaskLength((prev) => prev - 1);

    if (newSubTasks.length === 0) {
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
        setModalOpen(false);
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
      const eventDate = form.date ? getISODateFormat(form.date) : '';

      if (!location || !eventDate) {
        toast.error("Please select a country, state (if applicable), and a due date to get a forecast.");
        setIsWeatherLoading(false);
        return;
      }

      const res = await axiosInstance.get(
        `${location}/${eventDate}?unitGroup=metric&key=${
          process.env.NEXT_PUBLIC_API_KEY
        }`
      );
      setWeather(res.data);
      toast.success("Weather forecast fetched!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to fetch weather forecast.");
    } finally {
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
          className={`top-[15px] z-[10] sm:-top-[20px] right-[20px] sm:-right-[40px] absolute`}
          onClick={() => setModalOpen(false)}
        >
          <DynamicIcons iconName="iconoir:cancel" className="text-[28px] text-theme-blue cursor-pointer bg-white rounded-full" />
        </div>

        {(mode === "add" || mode === "edit") && (
          <div className="bg-white w-full max-h-[70vh] rounded-md relative overflow-scroll">
            <p className="text-theme-blue font-semibold border-b px-6 py-4 sticky top-0 bg-white">
              {`${mode === "edit" ? "Edit" : "Add"} Todo List`}
            </p>
            <form className="p-6 custom-scrollbar2" onSubmit={handleSubmit}>
              <TodoForm
                form={form}
                setForm={setForm}
                domId={domId}
                subTaskLength={subTaskLength}
                setSubTaskLength={setSubTaskLength}
                addSubTasks={addSubTasks}
                removeSubTask={removeSubTask}
              />

              <OutdoorEventWeather
                isAnOutDoorEvent={isAnOutDoorEvent}
                setIsAnOutDoorEvent={(checked) => setForm((prev) => ({ ...prev, isAnOutDoorEvent: checked }))}
                domId={domId}
                countries={countries}
                states={states}
                country={country}
                state={state}
                setForm={setForm}
                weather={weather}
                getWeatherForeCast={getWeatherForeCast}
                isWeatherLoading={isWeatherLoading}
              />

              <span className="text-[12px]">
                (N:B: You have to fill all required{" "}
                <span className="text-red-500">*</span> field to submit)
              </span>
              <div className="pt-4 flex gap-[20px] justify-end">
                <Button
                  type="submit"
                  className={`${
                    isFormValid
                      ? "bg-theme-blue cursor-pointer"
                      : "bg-[#cac9c9] cursor-not-allowed"
                  }`}
                  isLoading={isLoading}
                  disabled={!isFormValid || isLoading}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        )}

        {mode === "delete" && <DeletePrompt isLoading={isLoading} handleDelete={handleDelete}  />}
      </div>
    </div>
  );
};

export default TodoFormModal;
