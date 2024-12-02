import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './VolunteerStats.css';
import { getParks, getVolunteerStats } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to get previous 6 months
const getPreviousMonths = (): string[] => {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.unshift(date.toLocaleString('default', { month: 'long' }));
  }
  return months;
};

const VolunteerStats: React.FC = () => {
  const [topVolunteers, setTopVolunteers] = useState<any[]>([]);
  const [monthlyHours, setMonthlyHours] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoading(true);
        console.log("Fetching parks...");
        const parks = await getParks();
        console.log("Fetched parks:", parks);

        // Filter parks with missing or incomplete data
        const validParks = parks.filter((park: any) => {
          return park.name && park.latitude && park.longitude;
        });

        if (validParks.length === 0) {
          console.error("No valid parks found.");
          setError('No valid parks available.');
          return;
        }

        console.log("Valid parks:", validParks);

        const allStats = await Promise.all(
          validParks.map(async (park: any) => {
            try {
              const stats = await getVolunteerStats(park.id.toString());
              console.log(`Stats for park ${park.name}:`, stats);
              return { parkID: park.id, parkName: park.name, stats };
            } catch (err) {
              console.warn(`Failed to fetch stats for parkID ${park.id}:`, err);
              return { parkID: park.id, parkName: park.name, stats: null }; // Skip this park
            }
          })
        );

        // Filter out parks with failed stats
        const validStats = allStats.filter((entry) => entry.stats !== null);
        console.log("Valid stats:", validStats);

        // Aggregate stats
        const aggregatedVolunteers = validStats.flatMap((entry) =>
          (entry.stats.top3Users || []).map((user: any) => ({
            name: user.email || user.name, // Adjust based on backend data
            total_hours: user.total_hours || 0,
            total_opps: user.total_opps || 0,
            badges: user.badges || [],
          }))
        );
        console.log("Aggregated volunteers:", aggregatedVolunteers);

        const totalHoursPerMonth = [0, 0, 0, 0, 0, 0];
        validStats.forEach((entry) => {
          const parkMonthlyHours = entry.stats.monthlyHours || [];
          parkMonthlyHours.forEach((hours: number, index: number) => {
            totalHoursPerMonth[index] += hours;
          });
        });
        console.log("Total hours per month:", totalHoursPerMonth);

        setTopVolunteers(aggregatedVolunteers);
        setMonthlyHours(totalHoursPerMonth);
        setError(null);
      } catch (err) {
        console.error('Error fetching global stats:', err);
        setError('Failed to fetch global volunteer stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, []);

  const chartData = {
    labels: getPreviousMonths(),
    datasets: [
      {
        label: 'Total Hours Volunteered',
        data: monthlyHours,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="volunteer-stats">
      <h1>Volunteer Stats</h1>

      {loading && <p>Loading stats...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <h2>Top Volunteers</h2>
          {topVolunteers.length > 0 ? (
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
                {topVolunteers.map((volunteer, index) => (
                  <tr key={index}>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.total_hours}</td>
                    <td>{volunteer.total_opps}</td>
                    <td>{volunteer.badges?.join(', ') || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No volunteer stats available.</p>
          )}

          <h2>Volunteer Hours Over Time</h2>
          <div className="chart-container">
            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerStats;
