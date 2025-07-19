import axiosInstance from "@/api/axios";

async function getWeatherForeCast(location: string){
    const res = await axiosInstance.get(
        `${location}?unitGroup=metric&key=${
          process.env.NEXT_PUBLIC_API_KEY
        }`
      );
    return res.data
}

export {
    getWeatherForeCast
}