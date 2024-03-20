import React, { useState, useEffect, useMemo } from 'react';
import { fetchData } from './comp/fetchJSON';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 
import { GridOverlay } from '@mui/x-data-grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs, {Dayjs} from 'dayjs';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CovidData} from './comp/iface';
import {findMaxDate,findMinDate} from './comp/misc';
import OptimizedLineChart from './comp/LineChart';


const columns = [
  { field: 'dateRep', headerName: 'Дата', width: 150 },
  { field: 'countriesAndTerritories', headerName: 'Страна', width: 150 },
  { field: 'cases', headerName: 'Количество случаев', type: 'number', width: 180 },
  { field: 'deaths', headerName: 'Количество смертей', type: 'number', width: 180 },
  { field: 'countryterritoryCode', headerName: 'Код страны', width: 150 },
  { field: 'popData2019', headerName: 'Население', type: 'number', width: 130 },
  { field: 'continentExp', headerName: 'Континент', width: 150 }
];

function App() {
  const [data, setData] = useState<CovidData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //search 
  const [searchText, setSearchText] = useState('');
  const [country, setCountry] = useState('');

  //datepicker 
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);


  //filterReset
  const [filtersApplied, setFiltersApplied] = useState(false); 

  //chart 
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  //maxminday
  const [memoizedMaxDate, setMemoizedMaxDate] = useState<Dayjs | null>(null);
  const [memoizedMinDate, setMemoizedMinDate] = useState<Dayjs | null>(null);


  // stats
  useEffect(() => {
    fetchData().then((response) => {
      const typedData: CovidData[] = response.map((item: CovidData, index: number) => ({
        ...item,
        id: index.toString(),
      })).sort((a: CovidData, b: CovidData) => {
        // Parse dates in DD/MM/YYYY format to a format sortable by JavaScript
        const partsA = a.dateRep.split('/');
        const partsB = b.dateRep.split('/');
      
        // Create Date objects from the parsed date strings
        const dateA = new Date(Number(partsA[2]), Number(partsA[1]) - 1, Number(partsA[0]));
        const dateB = new Date(Number(partsB[2]), Number(partsB[1]) - 1, Number(partsB[0]));
      
        // Compare dates and return comparison result
        return dateA.getTime() - dateB.getTime();
      });
      console.log('stats')
      setMemoizedMaxDate(findMaxDate(typedData));
      setMemoizedMinDate(findMinDate(typedData));
      setData(typedData);
      setIsLoading(false);
    });
  }, []);


  //all countries
  const uniqueCountries = Array.from(new Set(data.map(item => item.countriesAndTerritories))).sort();

  const filteredData = data.filter((item) => {
    const itemDate = dayjs(item.dateRep);
    const isCountryMatch = item.countriesAndTerritories.toLowerCase().includes(searchText.toLowerCase());
    const isDateInRange = (!startDate || itemDate.isAfter(startDate.subtract(1, 'day'))) && (!endDate || itemDate.isBefore(endDate.add(1, 'day')));
    return isCountryMatch && isDateInRange;
}) as CovidData[];

  const clearFilters = () => {
    setSearchText('');
    setCountry('');
    setStartDate(null);
    setEndDate(null);
    setFiltersApplied(false);
  };

  // Simplification of Statistic's array based on sapmling rate
  const samplingRate = 50; 
  const sampledData = useMemo(() => {
      return filteredData.filter((_, index) => index % samplingRate === 0);
    }, [filteredData]);

  //will dissapear when app finish fetching data from endpoint
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
      }}>
        Loading data...
      </div>
    );
  }
  const NoRowsOverlay = () => (
    <GridOverlay>
      <div style={{ backgroundColor: 'white', padding: '20px' }}>Ничего не найдено</div>
    </GridOverlay>
  );

  return (
    <div className="container">
     <div className="row h-100 justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-sm-12 col-md-8 col-lg-10">
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: dayjs.Dayjs | null) => {
                setEndDate(newValue);
                setFiltersApplied(true);
            }}
            minDate={memoizedMinDate || undefined}
            maxDate={memoizedMaxDate || undefined} 
        />

        <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: dayjs.Dayjs | null) => {
                setEndDate(newValue);
                setFiltersApplied(true);
            }}
            minDate={memoizedMinDate || undefined}
            maxDate={memoizedMaxDate || undefined} 
        />
        </LocalizationProvider>
          <FormControl fullWidth>
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                  labelId="country-select-label"
                  value={country}
                  label="Country"
                  onChange={(e) => {
                      setCountry(e.target.value);
                      setSearchText(e.target.value);
                      setFiltersApplied(true);
                  }}
              >
                  {uniqueCountries.map((countryName, index) => (
                      <MenuItem key={index} value={countryName}>
                          {countryName}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
          {filtersApplied && (
            <Button variant="contained" onClick={clearFilters}>Clear Filters</Button>
          )}
          <Button variant="contained" onClick={() => setViewMode(viewMode === 'grid' ? 'chart' : 'grid')}>
            {viewMode === 'grid' ? 'Switch to Chart' : 'Switch to Grid'}
          </Button>
        </Box>
        {viewMode === 'grid' ? (
          <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          slots={{
            noRowsOverlay: NoRowsOverlay,
          }}
          rows={filteredData}
          columns={columns}
          disableColumnSelector
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 20]}
        />
        ) : (
          <OptimizedLineChart filteredData={sampledData}/>
        )}
      </div>
    </div>
  </div>
  );
}

export default App;
