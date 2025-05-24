import axios from 'axios';

interface ATMResponse {
  atms: Array<{
    id: string;
    lat: number;
    lon: number;
    name: string;
    address: string;
    hours?: string;
  }>;
}

export const fetchBitcoinATMs = async (latitude: number, longitude: number, radius = 10) => {
  try {
    // In a real application, this would make an API call to CoinMap or similar
    // Since we're using mock data for this demo, we'll just return fake ATMs
    
    // const response = await axios.get(`https://api.coinmap.org/v1/venues/atm?lat=${latitude}&lon=${longitude}&radius=${radius}`);
    // return response.data.atms;
    
    return generateMockATMs(latitude, longitude);
  } catch (error) {
    console.error('Error fetching Bitcoin ATMs:', error);
    throw error;
  }
};

const generateMockATMs = (latitude: number, longitude: number) => {
  // Generate random ATMs around the provided coordinates
  const atms = [];
  const atmCount = 8 + Math.floor(Math.random() * 7); // 8-15 ATMs
  
  const atmNames = [
    'Bitcoin Depot ATM',
    'CoinFlip Bitcoin ATM',
    'Bitcoin of America ATM',
    'Coinme Bitcoin Kiosk',
    'Bitcoin ATM by Coinsource',
    'RockItCoin Bitcoin ATM',
    'Bitcoin Teller',
    'Crypto Corner ATM',
    'BTC Quick Exchange',
    'Digital Currency ATM',
  ];
  
  const streets = [
    'Main St',
    'Broadway',
    'Park Ave',
    'Oak St',
    'Maple Rd',
    'Washington Blvd',
    'Market St',
    'Central Ave',
    'Highland Dr',
    'College St',
  ];
  
  const locations = [
    'Gas Station',
    'Convenience Store',
    'Shopping Mall',
    'Grocery Store',
    'Pharmacy',
    'Liquor Store',
    'Coffee Shop',
    'Hotel Lobby',
    'Tech Hub',
    'Laundromat',
  ];
  
  const hours = [
    '24/7',
    '8:00 AM - 10:00 PM',
    '9:00 AM - 9:00 PM',
    '7:00 AM - 11:00 PM',
    '6:00 AM - 12:00 AM',
  ];
  
  for (let i = 0; i < atmCount; i++) {
    // Random offset from the center point (-0.02 to 0.02 degrees, roughly 1-2km)
    const latOffset = (Math.random() * 0.04) - 0.02;
    const lonOffset = (Math.random() * 0.04) - 0.02;
    
    const streetNumber = Math.floor(Math.random() * 9000) + 1000;
    const streetName = streets[Math.floor(Math.random() * streets.length)];
    const locationName = locations[Math.floor(Math.random() * locations.length)];
    
    atms.push({
      id: `atm-${i}`,
      lat: latitude + latOffset,
      lon: longitude + lonOffset,
      name: atmNames[Math.floor(Math.random() * atmNames.length)],
      address: `${streetNumber} ${streetName}, ${locationName}`,
      hours: hours[Math.floor(Math.random() * hours.length)],
    });
  }
  
  return atms;
};