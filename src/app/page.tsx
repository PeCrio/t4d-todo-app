

import { HomeClient } from "./HomeClient"; 
// import { getAllCountries } from "@/requests/country-requests";
export default async function Home() {
  // const getCountries = await getAllCountries();
  // if(!getCountries){
  //     throw new Error('Fired')
  // }
  return <HomeClient />;
}
