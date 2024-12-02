import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './VolunteerStats.css';
import { getVolunteerStats } from '../services/api';
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

// Define types for volunteers and monthly data
interface Volunteer {
  name: string;
  email?: string; // Add `email` as optional since it might not always be present
  total_hours: number;
  total_opps: number;
  badges: string[];
}

interface MonthlyData {
  month: number;
  hours: number;
}

const VolunteerStats: React.FC = () => {
  const [topVolunteers, setTopVolunteers] = useState<Volunteer[]>([]);
  const [monthlyHours, setMonthlyHours] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const parkID = 1; // Replace with the actual parkID for the current admin

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const stats = await getVolunteerStats(parkID.toString()); // Fetch stats for a single park

        if (!stats) {
          setError('No stats available for the selected park.');
          return;
        }

        // Extract top volunteers
        const top3Users: Volunteer[] = stats.top3Users || [];
        const sortedVolunteers = top3Users
          .map((user: Volunteer) => ({
            name: user.name || user.email || 'Unknown', // Fallback to email if name is unavailable
            email: user.email,
            total_hours: user.total_hours || 0,
            total_opps: user.total_opps || 0,
            badges: user.badges || [],
          }))
          .sort((a: Volunteer, b: Volunteer) => b.total_hours - a.total_hours);

        setTopVolunteers(sortedVolunteers);

        // Extract monthly hours
        const monthlyHoursData: MonthlyData[] = stats.totalHours?.hours || [];
        const monthlyHoursArray = new Array(6).fill(0); // Default to zero for six months
        monthlyHoursData.forEach((monthData: MonthlyData) => {
          const monthIndex = monthData.month - 1; // Assuming backend returns 1-indexed months
          monthlyHoursArray[monthIndex % 6] += monthData.hours; // Rotate within last 6 months
        });

        setMonthlyHours(monthlyHoursArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching volunteer stats:', err);
        setError('Failed to fetch volunteer stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [parkID]); // Dependency array ensures this runs only when parkID changes

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
