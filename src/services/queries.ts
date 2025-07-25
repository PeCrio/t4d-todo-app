import axios from "axios"
import { toast } from "react-toastify";
import { getBaseUrl } from "@/utils/Constants";

const baseUrl = getBaseUrl();
export async function getAllCountries(){
    try{
        const { data } = await axios.get(`${baseUrl}/api/countries`);
        if(data){
            return data.data;
        }
    }catch(err){
        throw new Error((err as Error).message || "An error occurred.");
    }
}

export async function getStatesByCountry(id: number){
    try{
        const { data } = await axios.get(`${baseUrl}/api/countries/${id}/states`);
        if(data){
            return data.data;
        }
    }catch(err){
        toast.error((err as Error).message || "An error occurred.");
    }
}

