export const POINTS_PER_KG = 100;
export const BPJS_PER_MONTH = 10000; // 10k poin untuk 1 bulan BPJS
export const PICKUP_STATUS = {
  REQUESTED: 'REQUESTED',
  SCHEDULED: 'SCHEDULED',
  PICKED_UP: 'PICKED_UP',
  WEIGHED: 'WEIGHED',
  POINT_GRANTED: 'POINT_GRANTED',
  REDEEMED: 'REDEEMED'
};

export const STATUS_COLORS = {
  REQUESTED: 'bg-yellow-500',
  SCHEDULED: 'bg-blue-500',
  PICKED_UP: 'bg-purple-500',
  WEIGHED: 'bg-green-500',
  POINT_GRANTED: 'bg-emerald-500',
  REDEEMED: 'bg-indigo-500'
};

export const STATUS_LABELS = {
  REQUESTED: 'Menunggu',
  SCHEDULED: 'Dijadwalkan',
  PICKED_UP: 'Diambil',
  WEIGHED: 'Ditimbang',
  POINT_GRANTED: 'Poin Ditambahkan',
  REDEEMED: 'Ditukarkan'
};