import { Link } from 'react-router-dom';
import { Building2, Truck } from 'lucide-react';

export function AccountTypeSelect() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Select Account Type</h1>
        <p className="text-sm text-gray-400 mt-2">
          Choose how you want to use EnergyIQ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/register/supplier"
          className="group tap-effect rounded-2xl border border-[#2a2a2a] bg-[#161616] p-6 hover:border-[#FBC02D] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#FBC02D]/10 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-[#FBC02D]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Supplier</h2>
          <p className="text-sm text-gray-400">
            Register as a fuel supplier to manage products, orders, and distributors.
          </p>
        </Link>

        <Link
          to="/register/distributor"
          className="group tap-effect rounded-2xl border border-[#2a2a2a] bg-[#161616] p-6 hover:border-[#FBC02D] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#FBC02D]/10 flex items-center justify-center mb-4">
            <Truck className="w-6 h-6 text-[#FBC02D]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-1">Distributor</h2>
          <p className="text-sm text-gray-400">
            Register as a distributor to buy products and manage deliveries.
          </p>
        </Link>
      </div>
    </div>
  );
}
