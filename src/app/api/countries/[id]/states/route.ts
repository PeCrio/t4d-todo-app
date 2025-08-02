import { NextResponse } from "next/server";
import allData from '@/data/countries.json';
import { IAPIStructure } from "@/types/ListTypes";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const allDataArray = allData as IAPIStructure[];
  const paramsId = Number(params.id);
  
  const matchedCountry = allDataArray.find((country)=> country.id === paramsId)?.states
  if(matchedCountry){
    const formattedStates = matchedCountry.map((state) => ({
      name: state.name,
      id: state.id
    }));

    return NextResponse.json({message: 'States fetched successfully', data: formattedStates})
  } else{
    return NextResponse.json({message: 'No state found', data: []})
  }
}
