import { NextResponse } from "next/server";
import allData from '../../../data/countries.json'
import { ICountryStructure } from "@/types/ListTypes";

export async function GET(){
    const allDataArray = allData as ICountryStructure[]
    const countries = allDataArray.map(({ states, name, id }) => ({ name, id, states }));
    return NextResponse.json({message: 'Countries fetched successfully', data: countries})
}