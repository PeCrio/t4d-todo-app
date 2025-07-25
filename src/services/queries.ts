import axios from "axios"
import { toast } from "react-toastify";

export async function getAllCountries(){
    try{
        const { data } = await axios.get('http://localhost:3000/api/countries');
        if(data){
            return data.data;
        }
    }catch(err){
        toast.error((err as Error).message || "An error occurred.");
    }
}

export async function getStatesByCountry(id: number){
    try{
        const { data } = await axios.get(`http://localhost:3000/api/countries/${id}/states`);
        if(data){
            return data.data;
        }
    }catch(err){
        toast.error((err as Error).message || "An error occurred.");
    }
}

