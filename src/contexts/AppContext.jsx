import { createContext, useState, useContext } from 'react';
import { warkopBrands, pickupRequests, employees, products } from '../data/mockData';
import { PICKUP_STATUS } from '../data/constants';
import { calculatePoints } from '../data/utils';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [brands, setBrands] = useState(warkopBrands);
  const [pickups, setPickups] = useState(pickupRequests);
  const [empList, setEmpList] = useState(employees);
  const [productList, setProductList] = useState(products);
  const [selectedBrand, setSelectedBrand] = useState(warkopBrands[0]);

  // Brand Management
  const addBranch = (brandId, branchData) => {
    setBrands(brands.map(brand => 
      brand.id === brandId 
        ? { ...brand, branches: [...brand.branches, branchData] }
        : brand
    ));
  };

  const updateBranch = (brandId, branchId, branchData) => {
    setBrands(brands.map(brand => 
      brand.id === brandId 
        ? { 
            ...brand, 
            branches: brand.branches.map(branch => 
              branch.id === branchId ? { ...branch, ...branchData } : branch
            )
          }
        : brand
    ));
  };

  // Pickup Management
  const createPickupRequest = (brandId, branchIds, estimatedWeight) => {
    const brand = brands.find(b => b.id === brandId);
    const selectedBranches = brand.branches.filter(b => branchIds.includes(b.id));
    
    const newPickup = {
      id: pickups.length + 1,
      brandId,
      brandName: brand.name,
      branchIds,
      branches: selectedBranches.map(b => b.name),
      totalEstimatedWeight: estimatedWeight,
      status: PICKUP_STATUS.REQUESTED,
      requestedDate: new Date().toISOString().split('T')[0],
      scheduledDate: null,
      pickupTeam: null,
      actualWeight: null,
      pointsEarned: null
    };

    setPickups([...pickups, newPickup]);
    return newPickup;
  };

  const schedulePickup = (pickupId, scheduledDate, pickupTeam) => {
    setPickups(pickups.map(pickup => 
      pickup.id === pickupId 
        ? { ...pickup, status: PICKUP_STATUS.SCHEDULED, scheduledDate, pickupTeam }
        : pickup
    ));
  };

  const updatePickupStatus = (pickupId, status, actualWeight = null) => {
    const updatedPickups = pickups.map(pickup => {
      if (pickup.id === pickupId) {
        const updatedPickup = { ...pickup, status };
        
        if (actualWeight) {
          updatedPickup.actualWeight = actualWeight;
        }
        
        if (status === PICKUP_STATUS.WEIGHED && actualWeight) {
          const points = calculatePoints(actualWeight);
          updatedPickup.pointsEarned = points;
          
          // Tambahkan poin ke brand
          setBrands(brands.map(brand => 
            brand.id === pickup.brandId 
              ? { ...brand, totalPoints: brand.totalPoints + points }
              : brand
          ));
        }
        
        return updatedPickup;
      }
      return pickup;
    });

    setPickups(updatedPickups);
  };

  // Employee Management
  const toggleBPJS = (employeeId) => {
    setEmpList(empList.map(emp => 
      emp.id === employeeId 
        ? { ...emp, bpjsCovered: !emp.bpjsCovered }
        : emp
    ));
  };

  const addEmployee = (employeeData) => {
    const newEmployee = {
      id: empList.length + 1,
      ...employeeData,
      bpjsCovered: false,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setEmpList([...empList, newEmployee]);
  };

  // Product Exchange
  const exchangeProduct = (productId, brandId) => {
    const product = productList.find(p => p.id === productId);
    const brand = brands.find(b => b.id === brandId);
    
    if (brand.totalPoints >= product.points) {
      // Kurangi poin brand
      setBrands(brands.map(b => 
        b.id === brandId 
          ? { ...b, totalPoints: b.totalPoints - product.points }
          : b
      ));
      
      // Kurangi stock produk
      setProductList(productList.map(p => 
        p.id === productId 
          ? { ...p, stock: p.stock - 1 }
          : p
      ));
      
      return true;
    }
    return false;
  };

  const exchangeBPJS = (brandId, employeeCount) => {
    const brand = brands.find(b => b.id === brandId);
    const pointsNeeded = employeeCount * 10000; // 10k per pegawai
    
    if (brand.totalPoints >= pointsNeeded) {
      setBrands(brands.map(b => 
        b.id === brandId 
          ? { ...b, totalPoints: b.totalPoints - pointsNeeded }
          : b
      ));
      return true;
    }
    return false;
  };

  const contextValue = {
    brands,
    pickups,
    employees: empList,
    products: productList,
    selectedBrand,
    setSelectedBrand,
    addBranch,
    updateBranch,
    createPickupRequest,
    schedulePickup,
    updatePickupStatus,
    toggleBPJS,
    addEmployee,
    exchangeProduct,
    exchangeBPJS
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};