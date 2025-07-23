

import {
  ICountryStructure,
  IStateStructure,
  IWeatherStructure,
  IWeatherWithDateStructure,
} from "@/types/ListTypes";


export interface TodoFormState {
  name: string;
  description: string;
  date: string;
  tag: string;
  hasSubTasks: boolean;
  subTasks: string[];
  isAnOutDoorEvent: boolean;
  country: string;
  state: string;
}

export interface OutdoorEventWeatherProps {
  isAnOutDoorEvent: boolean;
  setIsAnOutDoorEvent: (checked: boolean) => void;
  domId: string;
  countries: ICountryStructure[];
  states: IStateStructure[];
  country: string;
  state: string;
  setForm: React.Dispatch<React.SetStateAction<TodoFormState>>;
  weather: IWeatherStructure | IWeatherWithDateStructure | undefined;
  getWeatherForeCast: () => Promise<void>;
  isWeatherLoading: boolean;
}
