import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaFilter, 
  FaCoins,
  FaBox,
  FaTruck,
  FaCheck
} from 'react-icons/fa';
import { GiRecycle } from 'react-icons/gi';

const Marketplace = ({ products, brandPoints, onPurchaseProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'Semua Produk' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Rumah Tangga' },
    { id: 'construction', name: 'Konstruksi' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = () => {
    if (selectedProduct && quantity > 0) {
      const success = onPurchaseProduct(selectedProduct.id, quantity);
      if (success) {
        setPurchaseSuccess(true);
        setTimeout(() => {
          setSelectedProduct(null);
          setPurchaseSuccess(false);
          setQuantity(1);
        }, 2000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Marketplace Produk MLP</h2>
          <p className="text-gray-600">Tukar poin dengan produk daur ulang berkualitas</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-amber-50 px-4 py-2 rounded-lg">
            <FaCoins className="text-amber-500 mr-2" />
            <span className="font-bold text-amber-600">{brandPoints.toLocaleString()}</span>
            <span className="ml-2 text-gray-600">poin tersedia</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === category.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner">
                <GiRecycle className="text-green-500 text-5xl" />
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {product.category}
                </span>
              </div>
              
              {/* Points & Stock */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaCoins className="text-amber-500 mr-2" />
                  <span className="text-xl font-bold text-amber-600">{product.pointsCost.toLocaleString()}</span>
                  <span className="ml-1 text-gray-600">poin</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaBox className="mr-1" />
                  Stok: {product.stock}
                </div>
              </div>
              
              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProduct(product)}
                disabled={product.stock === 0 || brandPoints < product.pointsCost}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center ${product.stock === 0 || brandPoints < product.pointsCost ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'} text-white transition-all`}
              >
                <FaShoppingCart className="mr-2" />
                {product.stock === 0 ? 'Stok Habis' : brandPoints < product.pointsCost ? 'Poin Kurang' : 'Beli dengan Poin'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => !purchaseSuccess && setSelectedProduct(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            {!purchaseSuccess ? (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaShoppingCart className="text-green-500 mr-2" />
                  Konfirmasi Pembelian
                </h3>
                
                <div className="space-y-4">
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <GiRecycle className="text-green-500 text-3xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-600 ml-auto">
                        Stok tersedia: {selectedProduct.stock}
                      </span>
                    </div>
                  </div>
                  
                  {/* Points Calculation */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-2">Ringkasan Pembelian</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Harga per unit</span>
                        <span className="font-medium flex items-center">
                          <FaCoins className="text-amber-500 mr-1" />
                          {selectedProduct.pointsCost.toLocaleString()} poin
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jumlah</span>
                        <span className="font-medium">{quantity} unit</span>
                      </div>
                      <div className="border-t border-amber-200 pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Poin</span>
                          <span className="text-lg text-amber-600 flex items-center">
                            <FaCoins className="mr-1" />
                            {(selectedProduct.pointsCost * quantity).toLocaleString()} poin
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Points Balance */}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Poin Anda:</span>
                    <span className="font-bold text-blue-600">{brandPoints.toLocaleString()} poin</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePurchase}
                      disabled={brandPoints < selectedProduct.pointsCost * quantity || selectedProduct.stock < quantity}
                      className={`flex-1 py-3 ${brandPoints < selectedProduct.pointsCost * quantity || selectedProduct.stock < quantity ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'} text-white rounded-xl font-semibold`}
                    >
                      <FaShoppingCart className="inline mr-2" />
                      Konfirmasi Pembelian
                    </motion.button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Success Message */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pembelian Berhasil!</h3>
                <p className="text-gray-600 mb-4">
                  Anda telah membeli {quantity} {selectedProduct.name}
                </p>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700">
                    Poin terpotong: <span className="font-bold text-red-600">{(selectedProduct.pointsCost * quantity).toLocaleString()}</span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Sisa poin: <span className="font-bold text-green-600">{(brandPoints - selectedProduct.pointsCost * quantity).toLocaleString()}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Produk akan dikirim dalam 3-5 hari kerja
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <GiRecycle className="text-green-500 mr-2" />
          Tentang Produk Daur Ulang MLP
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <GiRecycle className="text-green-500 text-xl" />
            </div>
            <p className="font-medium text-gray-800">Ramah Lingkungan</p>
            <p className="text-sm text-gray-600">Dibuat dari 100% plastik daur ulang</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaTruck className="text-blue-500 text-xl" />
            </div>
            <p className="font-medium text-gray-800">Gratis Pengiriman</p>
            <p className="text-sm text-gray-600">Untuk seluruh wilayah Indonesia</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaCoins className="text-amber-500 text-xl" />
            </div>
            <p className="font-medium text-gray-800">Hanya dengan Poin</p>
            <p className="text-sm text-gray-600">Tidak perlu uang tunai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;