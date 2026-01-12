const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PICKED_UP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'WEIGHED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'POINT_GRANTED': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'REQUESTED': return 'Menunggu';
      case 'SCHEDULED': return 'Dijadwalkan';
      case 'PICKED_UP': return 'Diambil';
      case 'WEIGHED': return 'Ditimbang';
      case 'POINT_GRANTED': return 'Poin Diberikan';
      default: return status;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;