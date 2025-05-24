import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchHistoricalData } from '../services/cryptoService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalData {
  prices: [number, number][];
}

const PriceChart: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchHistoricalData();
        setHistoricalData(data);
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !historicalData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse bg-secondary-200 dark:bg-secondary-700 w-full h-full rounded-lg"></div>
      </div>
    );
  }

  const labels = historicalData.prices.map(item => {
    const date = new Date(item[0]);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const prices = historicalData.prices.map(item => item[1]);

  const positiveChange = prices[prices.length - 1] >= prices[0];

  const data = {
    labels,
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: prices,
        borderColor: positiveChange ? '#10B981' : '#EF4444',
        backgroundColor: positiveChange
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          color: '#9AA5B1',
        },
        grid: {
          display: false,
        },
      },
      y: {
        position: 'right' as const,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
          color: '#9AA5B1',
        },
        grid: {
          color: '#E4E7EB',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default PriceChart;