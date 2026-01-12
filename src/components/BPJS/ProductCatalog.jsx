import { useState } from 'react'; // TAMBAHKAN INI DI BARIS PERTAMA
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { formatNumber } from '../../data/utils';

const ProductCatalog = ({ brand }) => {
  const { products, exchangeProduct } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleExchange = (productId) => {
    if (exchangeProduct(productId, brand.id)) {
      alert('Produk berhasil ditukarkan!');
      setSelectedProduct(null);
    } else {
      alert('Poin tidak cukup untuk menukar produk ini');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Katalog Produk</h3>
        <p className="text-gray-600">Hasil olahan plastik MLP yang bisa ditukar dengan poin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const canAfford = brand.totalPoints >= product.points;
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Product Image/Emoji */}
              <div className="h-48 bg-gradient-to-br from-sirsak-light to-sirsak-accent flex items-center justify-center">
                <span className="text-8xl">{product.image}</span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h4>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-sirsak-primary">
                      {formatNumber(product.points)}
                    </div>
                    <div className="text-sm text-gray-500">Poin</div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    product.stock > 5 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Stock: {product.stock}
                  </div>
                </div>

                {/* Exchange Button */}
                <motion.button
                  whileHover={{ scale: canAfford ? 1.02 : 1 }}
                  whileTap={{ scale: canAfford ? 0.98 : 1 }}
                  onClick={() => canAfford && setSelectedProduct(product)}
                  disabled={!canAfford}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                    canAfford
                      ? 'btn-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart />
                  <span>{canAfford ? 'Tukar Sekarang' : 'Poin Tidak Cukup'}</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedProduct.image}</div>
              <h4 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h4>
              <p className="text-gray-600 mt-2">Apakah yakin ingin menukar poin untuk produk ini?</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Harga:</span>
                <span className="font-bold text-sirsak-primary">
                  {formatNumber(selectedProduct.points)} poin
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Poin Anda:</span>
                <span className="font-bold">{formatNumber(brand.totalPoints)} poin</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>Poin Setelah Penukaran:</span>
                  <span className="text-green-600">
                    {formatNumber(brand.totalPoints - selectedProduct.points)} poin
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={() => handleExchange(selectedProduct.id)}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <FaCheck />
                <span>Konfirmasi</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductCatalog;