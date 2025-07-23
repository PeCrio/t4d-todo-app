import axios from "axios"

export async function getAllCountries(){
    try{
        const { data } = await axios.get('http://localhost:3000/api/countries');
        if(data){
            return data
        }
    }catch(err){
        console.log(err)
    }
}