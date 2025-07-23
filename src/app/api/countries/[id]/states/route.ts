import { NextResponse } from "next/server";
import allData from '@/data/countries.json';
import { ICountryStructure } from "@/types/ListTypes";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const countryId = Number(params.id);
  const allDataArray = allData as ICountryStructure[];

  const matchedCountry = allDataArray.find((country) => country.id === countryId);

  if (!matchedCountry) {
    return NextResponse.json({ message: 'Country not found', data: [] }, { status: 404 });
  }

  return NextResponse.json({
    message: 'States fetched successfully',
    data: matchedCountry.states || [],
  });
}
