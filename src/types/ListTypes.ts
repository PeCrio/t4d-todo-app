export type IListStructure = {
    tag: string;
    description: string;
    name: string;
    time: string;
    date: string;
    has_subtask: boolean;
    completed: boolean;
    id: number | string;
    subTasks?: string[];
}

export type ITagContext = {
    selectedTag: string | null;
    setSelectedTag: (tag: string) => void;
}

export type IFilterContextType = {
    selectedFilterQuery: string | null;
    setSelectedFilterQuery: (query: string) => void;
}

export interface ICountryStructure {
  id: number;
  name: string;
  phone_code: string;
  capital: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  latitude: string;
  longitude: string;
  states: IStateStructure[];
}

export interface IStateStructure {
  id: number;
  name: string;
  state_code: string;
  latitude: string;
  longitude: string;
  type: string | null;
  cities: ICityStructure[];
}

export interface ICityStructure {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

export interface IWeatherStructure {
  address: string;
  currentConditions: {
    conditions: string;
    temp: string;
    windspeed: string;
    icon: string;
  };
  description: string;
  latitude: string;
  longitude: string;
}

export interface IWeatherWithDateStructure {
  address: string;
  days: {
    dateTime: string;
    conditions: string;
    temp: string;
    windspeed: string;
    icon: string;
    description: string;
  }[];
  latitude: string;
  longitude: string;
}