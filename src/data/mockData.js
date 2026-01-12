import { PICKUP_STATUS } from './constants';

// Brands Warkop
export const warkopBrands = [
  {
    id: 1,
    name: "STK (Sari Terang Kita)",
    totalPoints: 12500,
    phone: "08123456789",
    email: "stk@email.com",
    joinDate: "2024-01-15",
    branches: [
      { 
        id: 1, 
        name: "STK Merdeka", 
        address: "Jl. Merdeka No. 12, Jakarta Pusat", 
        lat: -6.2088, 
        lng: 106.8456, 
        estimatedWeight: 45,
        lastPickup: "2024-11-25"
      },
      { 
        id: 2, 
        name: "STK Sudirman", 
        address: "Jl. Sudirman No. 45, Jakarta Selatan", 
        lat: -6.2089, 
        lng: 106.8457, 
        estimatedWeight: 32,
        lastPickup: "2024-11-20"
      },
      { 
        id: 3, 
        name: "STK Thamrin", 
        address: "Jl. Thamrin No. 8, Jakarta Pusat", 
        lat: -6.1800, 
        lng: 106.8240, 
        estimatedWeight: 28,
        lastPickup: "2024-11-22"
      }
    ]
  },
  {
    id: 2,
    name: "Kopi Kita",
    totalPoints: 8700,
    phone: "08198765432",
    email: "kopikita@email.com",
    joinDate: "2024-02-20",
    branches: [
      { 
        id: 4, 
        name: "Kopi Kita Kebayoran", 
        address: "Jl. Kebayoran Baru No. 15", 
        lat: -6.2400, 
        lng: 106.7990, 
        estimatedWeight: 38,
        lastPickup: "2024-11-18"
      }
    ]
  }
];

// Pickup Requests
export const pickupRequests = [
  {
    id: 1,
    brandId: 1,
    brandName: "STK (Sari Terang Kita)",
    branchIds: [1, 2],
    branches: ["STK Merdeka", "STK Sudirman"],
    totalEstimatedWeight: 77,
    status: PICKUP_STATUS.SCHEDULED,
    requestedDate: "2024-11-28",
    scheduledDate: "2024-12-05",
    pickupTeam: "Tim A",
    actualWeight: null,
    pointsEarned: null
  },
  {
    id: 2,
    brandId: 2,
    brandName: "Kopi Kita",
    branchIds: [4],
    branches: ["Kopi Kita Kebayoran"],
    totalEstimatedWeight: 38,
    status: PICKUP_STATUS.REQUESTED,
    requestedDate: "2024-11-29",
    scheduledDate: null,
    pickupTeam: null,
    actualWeight: null,
    pointsEarned: null
  },
  {
    id: 3,
    brandId: 1,
    brandName: "STK (Sari Terang Kita)",
    branchIds: [3],
    branches: ["STK Thamrin"],
    totalEstimatedWeight: 28,
    status: PICKUP_STATUS.WEIGHED,
    requestedDate: "2024-11-22",
    scheduledDate: "2024-11-25",
    pickupTeam: "Tim B",
    actualWeight: 30,
    pointsEarned: 3000
  }
];

// Employees
export const employees = [
  { id: 1, name: "Ahmad Santoso", position: "Kasir", salary: 3500000, bpjsCovered: true, joinDate: "2023-05-10" },
  { id: 2, name: "Siti Nurhaliza", position: "Barista", salary: 3800000, bpjsCovered: false, joinDate: "2023-06-15" },
  { id: 3, name: "Budi Raharjo", position: "Pelayan", salary: 3200000, bpjsCovered: true, joinDate: "2023-08-20" },
  { id: 4, name: "Dewi Lestari", position: "Manager", salary: 5000000, bpjsCovered: false, joinDate: "2023-03-05" },
];

// Products from recycled MLP
export const products = [
  { id: 1, name: "Tas Daur Ulang", points: 5000, stock: 15, image: "👜" },
  { id: 2, name: "Pot Tanaman", points: 2500, stock: 30, image: "🪴" },
  { id: 3, name: "Meja Kecil", points: 15000, stock: 8, image: "🪑" },
  { id: 4, name: "Keranjang", points: 3500, stock: 20, image: "🧺" },
  { id: 5, name: "Vas Bunga", points: 4500, stock: 12, image: "🏺" },
  { id: 6, name: "Lampu Hias", points: 8000, stock: 10, image: "💡" },
];

// Sirsak Warehouse Location
export const sirsakWarehouse = {
  name: "Gudang Sirsak",
  address: "Jl. Industri No. 123, Jakarta Timur",
  lat: -6.2250,
  lng: 106.9000
};

// Pickup Teams
export const pickupTeams = [
  { id: 1, name: "Tim A", driver: "Budi", vehicle: "Pickup Truck", capacity: 100 },
  { id: 2, name: "Tim B", driver: "Santi", vehicle: "Box Truck", capacity: 150 },
  { id: 3, name: "Tim C", driver: "Ahmad", vehicle: "Pickup Truck", capacity: 100 },
];

// Helper function untuk sortByDistance
export const sortByDistance = (branches, warehouse) => {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Jarak dalam km
  };

  return branches.map(branch => ({
    ...branch,
    distance: calculateDistance(branch.lat, branch.lng, warehouse.lat, warehouse.lng)
  })).sort((a, b) => a.distance - b.distance);
};