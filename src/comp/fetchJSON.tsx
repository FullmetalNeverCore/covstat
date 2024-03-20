export {}; 

export async function fetchData(){
    try{
        const response = await fetch('https://opendata.ecdc.europa.eu/covid19/casedistribution/json/');
        const data =  await response.json()
        return data.records || []; 
    }catch(error){
        console.log(error);
        return null; 
    }
}