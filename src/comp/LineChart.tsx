import React, { PureComponent } from 'react';
import { CovidData } from './iface';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OptimizedLineChartProps {
  filteredData: CovidData[]; 
}

class OptimizedLineChart extends PureComponent<OptimizedLineChartProps> {
  render() {
    const { filteredData } = this.props;
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateRep" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cases" stroke="#ff7c00" />
          <Line type="monotone" dataKey="deaths" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

export default OptimizedLineChart;