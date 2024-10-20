import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './VolunteerStats.css';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VolunteerStats: React.FC = () => {
  const volunteers = [
    { name: 'John Doe', hours: 150, events: 10 },
    { name: 'Jane Smith', hours: 120, events: 8 },
    { name: 'Alex Johnson', hours: 100, events: 7 },
  ];

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Total Hours Volunteered',
        data: [50, 75, 100, 120, 150, 160],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="volunteer-stats">
      <h1>Volunteer Stats</h1>

      <h2>Top Volunteers</h2>
      <table>
        <thead>
          <tr>
            <th>Volunteer</th>
            <th>Total Hours</th>
            <th>Events Participated</th>
            <th>Badges Earned</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((volunteer, index) => (
            <tr key={index}>
              <td>{volunteer.name}</td>
              <td>{volunteer.hours}</td>
              <td>{volunteer.events}</td>
              <td>{volunteer.hours >= 100 ? '🥇 Top Volunteer' : '🎖️ Active'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Volunteer Hours Over Time</h2>
      <div className="chart-container">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default VolunteerStats;
