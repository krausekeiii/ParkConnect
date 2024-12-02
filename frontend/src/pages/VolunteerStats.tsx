import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './VolunteerStats.css';
import { getParks, getVolunteerStats } from '../services/api';
import BronzeBadge from '../assets/bronze-badge.png'; // Example badge asset paths
import SilverBadge from '../assets/silver-badge.png';
import GoldBadge from '../assets/gold-badge.png';
import PlatinumBadge from '../assets/platinum-badge.png';

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

// Helper function to map badges to icons
const getBadgeIcon = (badge: string) => {
  const badgeStyles = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    verticalAlign: 'middle',
  };

  switch (badge) {
    case 'Bronze Volunteer':
      return <img src={BronzeBadge} alt="Bronze Badge" style={badgeStyles} />;
    case 'Silver Volunteer':
      return <img src={SilverBadge} alt="Silver Badge" style={badgeStyles} />;
    case 'Gold Volunteer':
      return <img src={GoldBadge} alt="Gold Badge" style={badgeStyles} />;
    case 'Platinum Volunteer':
      return <img src={PlatinumBadge} alt="Platinum Badge" style={badgeStyles} />;
    default:
      return null;
  }
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
        const parks = await getParks();

        // Validate parks data
        const validParks = parks.filter((park: any) => park.name && park.latitude && park.longitude);

        if (validParks.length === 0) {
          setError('No valid parks available.');
          return;
        }

        const allStats = await Promise.all(
          validParks.map(async (park: any) => {
            try {
              const stats = await getVolunteerStats(park.id.toString());
              return { parkID: park.id, parkName: park.name, stats };
            } catch (err) {
              console.warn(`Failed to fetch stats for parkID ${park.id}:`, err);
              return { parkID: park.id, parkName: park.name, stats: null };
            }
          })
        );

        // Filter out parks with failed stats
        const validStats = allStats.filter((entry) => entry.stats !== null);

        // Aggregate top volunteers
        const aggregatedVolunteers = validStats.flatMap((entry) =>
          (entry.stats.top3Users || []).map((user: any) => ({
            name: user.name || user.email,
            total_hours: user.total_hours || 0,
            total_opps: user.total_opps || 0,
            badges: user.badges || [],
          }))
        );

        // Sort and limit to top 10 volunteers
        const top10Volunteers = aggregatedVolunteers
          .sort((a, b) => b.total_hours - a.total_hours)
          .slice(0, 10);

        // Aggregate monthly hours
        const totalHoursPerMonth = [0, 0, 0, 0, 0, 0];
        validStats.forEach((entry) => {
          const monthlyHoursData = entry.stats.totalHours?.hours || [];
          monthlyHoursData.forEach((monthData: any) => {
            const monthIndex = monthData.month - 1; // Assuming backend returns 1-indexed months
            totalHoursPerMonth[monthIndex % 6] += monthData.hours; // Rotate within last 6 months
          });
        });

        setTopVolunteers(top10Volunteers);
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
            <div className="volunteer-table-wrapper">
              <table className="volunteer-table">
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
                      <td>
                        {volunteer.badges.length > 0
                          ? volunteer.badges.map((badge: string) => getBadgeIcon(badge))
                          : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
