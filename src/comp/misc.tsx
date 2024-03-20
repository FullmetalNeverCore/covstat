import dayjs, { Dayjs } from 'dayjs';
import { CovidData } from './iface';


export function findMinDate(data: CovidData[]): Dayjs {
    if (data.length === 0) {
        throw new Error('The data array is empty.');
    }

    let minDate = dayjs(data[0].dateRep, 'DD/MM/YYYY');

    for (let i = 1; i < data.length; i++) {
        const itemDate = dayjs(data[i].dateRep, 'DD/MM/YYYY');
        if (itemDate.isBefore(minDate)) {
            minDate = itemDate;
        }
    }

    console.log("Min Date:", minDate.format("YYYY-MM-DD"));
    return minDate;
}

export function findMaxDate(data: CovidData[]): Dayjs {
    if (data.length === 0) {
        throw new Error('The data array is empty.');
    }

    let maxDate = dayjs(data[0].dateRep, 'DD/MM/YYYY');

    for (let i = 1; i < data.length; i++) {
        const itemDate = dayjs(data[i].dateRep, 'DD/MM/YYYY');
        if (itemDate.isAfter(maxDate)) {
            maxDate = itemDate;
        }
    }

    console.log("Max Date:", maxDate.format("YYYY-MM-DD"));
    return maxDate;
}
