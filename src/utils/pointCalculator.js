import { POINT_CONVERSION } from '../data/constants';

export const calculatePoints = (weightInKg) => {
  return weightInKg * POINT_CONVERSION.KG_TO_POINTS;
};

export const calculateBPJSCost = (months, numberOfEmployees) => {
  return months * numberOfEmployees * POINT_CONVERSION.BPJS_PER_MONTH;
};

export const formatPoints = (points) => {
  return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const canRedeemBPJS = (availablePoints, employeesCount, months = 1) => {
  const required = calculateBPJSCost(months, employeesCount);
  return availablePoints >= required;
};