
//   ISO to long date format ("2025-07-08" to "July 05, 2025")
export function formatToLongDate(dateStr: string): string {
    const parsedDate = new Date(dateStr);
  
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date string");
    }
  
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
  
    return parsedDate.toLocaleDateString("en-US", options);
}
  

//   long date format to ISO ("July 05, 2025" to "2025-07-08")
export function convertLongDateToISO(longDate: string): string {
    const parsedDate = new Date(longDate);
  
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid long date string");
    }
  
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
}
