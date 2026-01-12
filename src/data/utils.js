import { POINTS_PER_KG, BPJS_PER_MONTH } from './constants';

export const calculatePoints = (weight) => {
  return weight * POINTS_PER_KG;
};

export const calculateBPJSMembers = (points) => {
  return Math.floor(points / BPJS_PER_MONTH);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Hapus fungsi calculateDistance dan sortByDistance karena sudah ada di mockData.js
// export const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius bumi dalam km
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c; // Jarak dalam km
// };

// export const sortByDistance = (branches, warehouse) => {
//   return branches.map(branch => ({
//     ...branch,
//     distance: calculateDistance(branch.lat, branch.lng, warehouse.lat, warehouse.lng)
//   })).sort((a, b) => a.distance - b.distance);
// };