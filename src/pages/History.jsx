import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

import { Clock, FileText, Trash2, Download } from 'lucide-react';
import FuzzyText from '../components/FuzzyText';
import { generatePDF } from '../utils/pdfGenerator';
import GoldButton from '../components/GoldButton';

const History = () => {
  const invoiceHistory = useStore((state) => state.invoiceHistory);
  const deleteFromHistory = useStore((state) => state.deleteFromHistory);

  const handleExport = (invoice) => {
    generatePDF(invoice);
  };

  return (
    <div 
      className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
        <Clock className="w-10 h-10 text-[#D4AF37]" />
        <div>
          <FuzzyText className="text-3xl md:text-4xl mb-1">Invoice History</FuzzyText>
          <p className="text-gray-400">Past processed and generated invoices</p>
        </div>
      </div>

      {invoiceHistory.length === 0 ? (
        <div className="glassmorphism p-10 rounded-3xl text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No Invoices Yet</h3>
          <p className="text-gray-500 mb-6">You haven't saved any invoices to your history.</p>
          <Link to="/">
            <GoldButton>Upload a New Invoice</GoldButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invoiceHistory.map((invoice) => (
            <div 
              key={invoice.id}
              className="glassmorphism p-6 rounded-3xl hover:border-[#D4AF37]/50 transition-colors group animate-in zoom-in-95 fade-in"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                    {invoice.invoiceNumber || 'Untitled Invoice'}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{invoice.vendorName || 'Unknown Vendor'}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-bold text-white">
                    ${(invoice.totalAmount || 0).toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm">{invoice.date}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-800/50">
                <span className="text-sm text-gray-400">
                  {invoice.items?.length || 0} line items
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(invoice)}
                    className="p-2 text-gray-400 hover:text-[#D4AF37] bg-black/30 rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                    title="Export PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteFromHistory(invoice.id)}
                    className="p-2 text-gray-400 hover:text-red-400 bg-black/30 rounded-lg hover:bg-red-400/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
