import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSirsakStore = create(
  persist(
    (set, get) => ({
      // Data awal
      pickupRequests: [
        {
          id: 1,
          warkopName: "STK Sudirman",
          branchId: 101,
          estimatedWeight: 25,
          address: "Jl. Sudirman No. 123",
          lat: -6.2088,
          lng: 106.8456,
          status: "REQUESTED", // REQUESTED → SCHEDULED → PICKED_UP → WEIGHED → POINT_GRANTED
          requestDate: "2024-01-15",
          scheduledDate: null,
          actualWeight: null,
          pointsGenerated: 0,
          assignedDriver: null,
          driverId: null, // ✅ BARU: Simpan ID driver
        },
        {
          id: 2,
          warkopName: "STK Senayan",
          branchId: 102,
          estimatedWeight: 35,
          address: "Jl. Senayan No. 45",
          lat: -6.2275,
          lng: 106.7997,
          status: "REQUESTED",
          requestDate: "2024-01-16",
          scheduledDate: null,
          actualWeight: null,
          pointsGenerated: 0,
          assignedDriver: null,
          driverId: null, // ✅ BARU: Simpan ID driver
        }
      ],
      
      // ✅ DIPERBAHARUI: Lebih banyak driver dengan kapasitas
      drivers: [
        { id: 1, name: "Ahmad Supriyadi", vehicle: "Pickup Truck", status: "available", capacity: 500 },
        { id: 2, name: "Budi Santoso", vehicle: "Box Truck", status: "available", capacity: 1000 },
        { id: 3, name: "Cahyo Wijaya", vehicle: "Pickup Truck", status: "available", capacity: 500 },
        { id: 4, name: "Dewi Lestari", vehicle: "Mini Truck", status: "available", capacity: 300 },
        { id: 5, name: "Eko Pratama", vehicle: "Box Truck", status: "available", capacity: 1200 }
      ],
      
      warehouseLocation: { lat: -6.3016, lng: 106.6529, name: "Gudang Sirsak Tangerang" },
      
      recentActivities: [
        { id: 1, action: "Pickup Scheduled", warkop: "STK Thamrin", time: "10:30", date: "2024-01-14" },
        { id: 2, action: "Points Granted", warkop: "Kopi Kenangan", points: 4500, time: "09:15", date: "2024-01-14" },
        { id: 3, action: "Weight Validated", warkop: "Fore Coffee", weight: "32 kg", time: "15:45", date: "2024-01-13" }
      ],
      
      // Statistics
      stats: {
        totalPickups: 48,
        totalWeight: 1245, // kg
        totalPoints: 124500, // 1kg = 100 points
        pendingRequests: 2,
        scheduledToday: 0, // ✅ DIPERBAHARUI: Mulai dari 0
        completedThisMonth: 45
      },
      
      // Actions
      schedulePickup: (requestId, driverId, scheduledDate) => {
        const driver = get().drivers.find(d => d.id === driverId);
        set((state) => ({
          pickupRequests: state.pickupRequests.map(req => 
            req.id === requestId 
              ? { 
                  ...req, 
                  status: "SCHEDULED", 
                  scheduledDate, 
                  assignedDriver: driver?.name,
                  driverId: driverId // ✅ SIMPAN ID DRIVER
                } 
              : req
          ),
          drivers: state.drivers.map(d => 
            d.id === driverId ? { ...d, status: "on_duty" } : d
          ),
          stats: {
            ...state.stats,
            pendingRequests: Math.max(0, state.stats.pendingRequests - 1),
            scheduledToday: state.stats.scheduledToday + 1 // ✅ UPDATE STATS
          },
          recentActivities: [
            { 
              id: Date.now(), 
              action: "Pickup Scheduled", 
              warkop: state.pickupRequests.find(r => r.id === requestId)?.warkopName,
              driver: driver?.name,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              date: new Date().toISOString().split('T')[0]
            },
            ...state.recentActivities
          ].slice(0, 10)
        }));
      },
      
      markAsPickedUp: (requestId) => {
        set((state) => ({
          pickupRequests: state.pickupRequests.map(req => 
            req.id === requestId ? { ...req, status: "PICKED_UP" } : req
          ),
          recentActivities: [
            { 
              id: Date.now(), 
              action: "Pickup Completed", 
              warkop: state.pickupRequests.find(r => r.id === requestId)?.warkopName,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              date: new Date().toISOString().split('T')[0]
            },
            ...state.recentActivities
          ].slice(0, 10)
        }));
      },
      
      recordWeightAndPoints: (requestId, actualWeight) => {
        const points = actualWeight * 100; // 1kg = 100 points
        const request = get().pickupRequests.find(req => req.id === requestId);
        
        set((state) => ({
          pickupRequests: state.pickupRequests.map(req => 
            req.id === requestId 
              ? { 
                  ...req, 
                  status: "POINT_GRANTED", 
                  actualWeight, 
                  pointsGenerated: points 
                } 
              : req
          ),
          // ✅ RESET STATUS DRIVER JIKA ADA
          drivers: state.drivers.map(d => 
            d.id === request?.driverId ? { ...d, status: "available" } : d
          ),
          stats: {
            ...state.stats,
            totalWeight: state.stats.totalWeight + actualWeight,
            totalPoints: state.stats.totalPoints + points,
            completedThisMonth: state.stats.completedThisMonth + 1,
            scheduledToday: Math.max(0, state.stats.scheduledToday - 1) // ✅ KURANGI SCHEDULED
          },
          recentActivities: [
            { 
              id: Date.now(), 
              action: "Points Granted", 
              warkop: state.pickupRequests.find(r => r.id === requestId)?.warkopName,
              points: points,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              date: new Date().toISOString().split('T')[0]
            },
            ...state.recentActivities
          ].slice(0, 10)
        }));
      },
      
      addNotification: (message) => {
        set((state) => ({
          recentActivities: [
            { 
              id: Date.now(), 
              action: "Notification", 
              message,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              date: new Date().toISOString().split('T')[0]
            },
            ...state.recentActivities
          ].slice(0, 10)
        }));
      },
      
      // Simulasi notifikasi baru
      simulateNewRequest: () => {
        const newId = get().pickupRequests.length + 1;
        const warkops = ["STK", "Kopi Kenangan", "Fore Coffee", "Janji Jiwa", "Kopi Kita"];
        const branches = ["Sudirman", "Senayan", "Thamrin", "Kuningan", "Gatot Subroto"];
        const randomWarkop = warkops[Math.floor(Math.random() * warkops.length)];
        const randomBranch = branches[Math.floor(Math.random() * branches.length)];
        
        const newRequest = {
          id: newId,
          warkopName: `${randomWarkop} ${randomBranch}`,
          branchId: 100 + newId,
          estimatedWeight: Math.floor(Math.random() * 50) + 10,
          address: `Jl. ${randomBranch} No. ${Math.floor(Math.random() * 200)}`,
          lat: -6.2 + (Math.random() * 0.1 - 0.05),
          lng: 106.8 + (Math.random() * 0.1 - 0.05),
          status: "REQUESTED",
          requestDate: new Date().toISOString().split('T')[0],
          scheduledDate: null,
          actualWeight: null,
          pointsGenerated: 0,
          assignedDriver: null,
          driverId: null, // ✅ BARU: Tambah driverId
        };
        
        set((state) => ({
          pickupRequests: [newRequest, ...state.pickupRequests],
          stats: {
            ...state.stats,
            pendingRequests: state.stats.pendingRequests + 1,
            totalPickups: state.stats.totalPickups + 1
          }
        }));
        
        // Tambah notifikasi
        get().addNotification(`Warkop ${newRequest.warkopName} mengajukan pickup baru (estimasi: ${newRequest.estimatedWeight} kg)`);
      },

      // ✅ BARU: Fungsi untuk reset data ke kondisi awal
      resetDemoData: () => {
        set({
          pickupRequests: [
            {
              id: 1,
              warkopName: "STK Sudirman",
              branchId: 101,
              estimatedWeight: 25,
              address: "Jl. Sudirman No. 123",
              lat: -6.2088,
              lng: 106.8456,
              status: "REQUESTED",
              requestDate: new Date().toISOString().split('T')[0],
              scheduledDate: null,
              actualWeight: null,
              pointsGenerated: 0,
              assignedDriver: null,
              driverId: null,
            },
            {
              id: 2,
              warkopName: "STK Senayan",
              branchId: 102,
              estimatedWeight: 35,
              address: "Jl. Senayan No. 45",
              lat: -6.2275,
              lng: 106.7997,
              status: "REQUESTED",
              requestDate: new Date().toISOString().split('T')[0],
              scheduledDate: null,
              actualWeight: null,
              pointsGenerated: 0,
              assignedDriver: null,
              driverId: null,
            }
          ],
          drivers: [
            { id: 1, name: "Ahmad Supriyadi", vehicle: "Pickup Truck", status: "available", capacity: 500 },
            { id: 2, name: "Budi Santoso", vehicle: "Box Truck", status: "available", capacity: 1000 },
            { id: 3, name: "Cahyo Wijaya", vehicle: "Pickup Truck", status: "available", capacity: 500 },
            { id: 4, name: "Dewi Lestari", vehicle: "Mini Truck", status: "available", capacity: 300 },
            { id: 5, name: "Eko Pratama", vehicle: "Box Truck", status: "available", capacity: 1200 }
          ],
          warehouseLocation: { lat: -6.3016, lng: 106.6529, name: "Gudang Sirsak Tangerang" },
          recentActivities: [
            { id: 1, action: "Pickup Scheduled", warkop: "STK Thamrin", time: "10:30", date: "2024-01-14" },
            { id: 2, action: "Points Granted", warkop: "Kopi Kenangan", points: 4500, time: "09:15", date: "2024-01-14" },
            { id: 3, action: "Weight Validated", warkop: "Fore Coffee", weight: "32 kg", time: "15:45", date: "2024-01-13" }
          ],
          stats: {
            totalPickups: 48,
            totalWeight: 1245,
            totalPoints: 124500,
            pendingRequests: 2,
            scheduledToday: 0,
            completedThisMonth: 45
          }
        });
      },

      // ✅ BARU: Fungsi untuk hapus semua data dari localStorage
      clearAllData: () => {
        localStorage.removeItem('sirsak-storage');
        window.location.reload(); // Reload halaman untuk reset state
      },
    }),
    {
      name: 'sirsak-storage',
      partialize: (state) => ({ 
        pickupRequests: state.pickupRequests,
        drivers: state.drivers, // ✅ PASTIKAN DRIVERS DISIMPAN
        warehouseLocation: state.warehouseLocation,
        stats: state.stats,
        recentActivities: state.recentActivities
      })
    }
  )
);

// ✅ BARU: Helper untuk cek data di localStorage (untuk debug)
export const checkStorageData = () => {
  const data = localStorage.getItem('sirsak-storage');
  return data ? JSON.parse(data) : null;
};

// ✅ BARU: Helper untuk hapus data spesifik
export const clearStorageData = () => {
  localStorage.removeItem('sirsak-storage');
  console.log('LocalStorage data cleared');
};