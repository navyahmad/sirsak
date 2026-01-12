import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWarkopStore = create(
  persist(
    (set, get) => ({
      // Brand Data
      brand: {
        id: 1,
        name: "STK Coffee",
        points: 124500,
        phone: "+62 812-3456-7890",
        email: "admin@stkcoffee.com"
      },
      
      // Branches
      branches: [
        {
          id: 101,
          name: "STK Sudirman",
          address: "Jl. Sudirman No. 123, Jakarta",
          lat: -6.2088,
          lng: 106.8456,
          phone: "+62 812-1111-2222",
          manager: "Budi Santoso",
          status: "active",
          estimatedWeight: 25 // kg
        },
        {
          id: 102,
          name: "STK Senayan",
          address: "Jl. Senayan No. 45, Jakarta",
          lat: -6.2275,
          lng: 106.7997,
          phone: "+62 812-3333-4444",
          manager: "Sari Wijaya",
          status: "active",
          estimatedWeight: 35
        },
        {
          id: 103,
          name: "STK Thamrin",
          address: "Jl. Thamrin No. 78, Jakarta",
          lat: -6.1865,
          lng: 106.8226,
          phone: "+62 812-5555-6666",
          manager: "Agus Prasetyo",
          status: "inactive",
          estimatedWeight: 15
        }
      ],
      
      // Employees
      employees: [
        {
          id: 1001,
          name: "Budi Santoso",
          position: "Manager Cabang",
          branchId: 101,
          salary: 5000000,
          bpjsStatus: "active",
          bpjsPaidUntil: "2024-12-31",
          pointsUsedForBPJS: 120000
        },
        {
          id: 1002,
          name: "Sari Wijaya",
          position: "Kasir",
          branchId: 102,
          salary: 3500000,
          bpjsStatus: "active",
          bpjsPaidUntil: "2024-12-31",
          pointsUsedForBPJS: 84000
        },
        {
          id: 1003,
          name: "Agus Prasetyo",
          position: "Barista",
          branchId: 103,
          salary: 3000000,
          bpjsStatus: "inactive",
          bpjsPaidUntil: null,
          pointsUsedForBPJS: 0
        },
        {
          id: 1004,
          name: "Dewi Lestari",
          position: "Waitress",
          branchId: 101,
          salary: 2800000,
          bpjsStatus: "pending",
          bpjsPaidUntil: "2024-06-30",
          pointsUsedForBPJS: 67200
        }
      ],
      
      // Pickup Requests
      pickupRequests: [
        {
          id: 1,
          branchId: 101,
          branchName: "STK Sudirman",
          estimatedWeight: 25,
          requestDate: "2024-01-15",
          status: "REQUESTED", // REQUESTED → SCHEDULED → PICKED_UP → WEIGHED → POINT_GRANTED
          scheduledDate: null,
          actualWeight: null,
          pointsGranted: 0
        },
        {
          id: 2,
          branchId: 102,
          branchName: "STK Senayan",
          estimatedWeight: 35,
          requestDate: "2024-01-14",
          status: "POINT_GRANTED",
          scheduledDate: "2024-01-16",
          actualWeight: 32,
          pointsGranted: 3200
        }
      ],
      
      // Transactions (Poin ke BPJS/Produk)
      transactions: [
        {
          id: 1,
          type: "bpjs_payment",
          employeeId: 1001,
          employeeName: "Budi Santoso",
          pointsUsed: 120000,
          date: "2024-01-10",
          status: "completed",
          details: "BPJS 12 bulan"
        },
        {
          id: 2,
          type: "product_purchase",
          productId: 301,
          productName: "Tas Daur Ulang",
          pointsUsed: 2000,
          date: "2024-01-12",
          status: "shipped",
          details: "Kode tracking: TRK-12345"
        }
      ],
      
      // Marketplace Products
      mlpProducts: [
        {
          id: 301,
          name: "Tas Daur Ulang",
          description: "Tas cantik dari daur ulang plastik MLP",
          pointsCost: 2000,
          stock: 45,
          category: "fashion",
          image: "https://cdn-icons-png.flaticon.com/512/3082/3082383.png"
        },
        {
          id: 302,
          name: "Pot Plastik",
          description: "Pot tanaman dari plastik daur ulang",
          pointsCost: 1500,
          stock: 120,
          category: "home",
          image: "https://cdn-icons-png.flaticon.com/512/2098/2098402.png"
        },
        {
          id: 303,
          name: "Paving Block",
          description: "Paving block ramah lingkungan",
          pointsCost: 5000,
          stock: 80,
          category: "construction",
          image: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
        },
        {
          id: 304,
          name: "Kaos Daur Ulang",
          description: "Kaos dari serat plastik daur ulang",
          pointsCost: 3500,
          stock: 25,
          category: "fashion",
          image: "https://cdn-icons-png.flaticon.com/512/3082/3082383.png"
        }
      ],
      
      // BPJS Calculation Rates
      bpjsRates: {
        monthly: 10000, // poin per bulan per pegawai
        calculation: "salary * 0.04", // simulasi perhitungan
        minMonths: 6
      },
      
      // Actions
      addBranch: (branchData) => {
        const newId = Math.max(...get().branches.map(b => b.id)) + 1;
        set((state) => ({
          branches: [...state.branches, { ...branchData, id: newId }]
        }));
      },
      
      updateBranch: (branchId, updates) => {
        set((state) => ({
          branches: state.branches.map(branch =>
            branch.id === branchId ? { ...branch, ...updates } : branch
          )
        }));
      },
      
      requestPickup: (branchId, estimatedWeight) => {
        const branch = get().branches.find(b => b.id === branchId);
        const newId = Math.max(...get().pickupRequests.map(p => p.id)) + 1;
        
        const newRequest = {
          id: newId,
          branchId,
          branchName: branch.name,
          estimatedWeight,
          requestDate: new Date().toISOString().split('T')[0],
          status: "REQUESTED",
          scheduledDate: null,
          actualWeight: null,
          pointsGranted: 0
        };
        
        set((state) => ({
          pickupRequests: [newRequest, ...state.pickupRequests]
        }));
      },
      
      addEmployee: (employeeData) => {
        const newId = Math.max(...get().employees.map(e => e.id)) + 1;
        set((state) => ({
          employees: [...state.employees, { ...employeeData, id: newId }]
        }));
      },
      
      redeemForBPJS: (employeeId, months) => {
        const pointsNeeded = months * get().bpjsRates.monthly;
        const employee = get().employees.find(e => e.id === employeeId);
        
        if (get().brand.points >= pointsNeeded) {
          const newId = Math.max(...get().transactions.map(t => t.id)) + 1;
          
          set((state) => ({
            brand: {
              ...state.brand,
              points: state.brand.points - pointsNeeded
            },
            employees: state.employees.map(emp =>
              emp.id === employeeId
                ? {
                    ...emp,
                    bpjsStatus: "active",
                    bpjsPaidUntil: calculateNewDate(emp.bpjsPaidUntil, months),
                    pointsUsedForBPJS: emp.pointsUsedForBPJS + pointsNeeded
                  }
                : emp
            ),
            transactions: [
              {
                id: newId,
                type: "bpjs_payment",
                employeeId,
                employeeName: employee.name,
                pointsUsed: pointsNeeded,
                date: new Date().toISOString().split('T')[0],
                status: "completed",
                details: `BPJS ${months} bulan`
              },
              ...state.transactions
            ]
          }));
          
          return true;
        }
        return false;
      },
      
      purchaseProduct: (productId, quantity) => {
        const product = get().mlpProducts.find(p => p.id === productId);
        const totalCost = product.pointsCost * quantity;
        
        if (get().brand.points >= totalCost && product.stock >= quantity) {
          const newId = Math.max(...get().transactions.map(t => t.id)) + 1;
          
          set((state) => ({
            brand: {
              ...state.brand,
              points: state.brand.points - totalCost
            },
            mlpProducts: state.mlpProducts.map(p =>
              p.id === productId ? { ...p, stock: p.stock - quantity } : p
            ),
            transactions: [
              {
                id: newId,
                type: "product_purchase",
                productId,
                productName: product.name,
                pointsUsed: totalCost,
                date: new Date().toISOString().split('T')[0],
                status: "processing",
                details: `Quantity: ${quantity}`
              },
              ...state.transactions
            ]
          }));
          
          return true;
        }
        return false;
      },
      
      // Simulate new points from pickup
      simulatePointsGranted: (requestId, actualWeight) => {
        const points = actualWeight * 100; // 1kg = 100 poin
        
        set((state) => ({
          brand: {
            ...state.brand,
            points: state.brand.points + points
          },
          pickupRequests: state.pickupRequests.map(req =>
            req.id === requestId
              ? {
                  ...req,
                  status: "POINT_GRANTED",
                  actualWeight,
                  pointsGranted: points
                }
              : req
          )
        }));
      },
      
      // Calculate BPJS points needed
      calculateBPJSPoints: (employeeId, months = 12) => {
        const employee = get().employees.find(e => e.id === employeeId);
        if (!employee) return 0;
        
        // Simulasi perhitungan BPJS berdasarkan gaji
        const basePoints = months * get().bpjsRates.monthly;
        const salaryFactor = employee.salary * 0.00004; // 0.004% dari gaji
        return Math.round(basePoints + salaryFactor);
      }
    }),
    {
      name: 'warkop-storage',
      partialize: (state) => ({
        brand: state.brand,
        branches: state.branches,
        employees: state.employees,
        pickupRequests: state.pickupRequests,
        transactions: state.transactions,
        mlpProducts: state.mlpProducts
      })
    }
  )
);

// Helper function
const calculateNewDate = (currentDate, months) => {
  const date = currentDate ? new Date(currentDate) : new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};