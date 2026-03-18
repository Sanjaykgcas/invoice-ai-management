import { useEffect } from 'react';
import useStore from '../store/useStore';
import { generatePDF } from '../utils/pdfGenerator';
import { Plus, Trash2, Cpu, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
import GoldButton from '../components/GoldButton';
import FuzzyText from '../components/FuzzyText';

const CreateInvoice = () => {
  const currentInvoice = useStore((state) => state.currentInvoice);
  const setCurrentInvoice = useStore((state) => state.setCurrentInvoice);
  const updateField = useStore((state) => state.updateInvoiceField);
  const updateItem = useStore((state) => state.updateInvoiceItem);
  const addItem = useStore((state) => state.addItem);
  const removeItem = useStore((state) => state.removeItem);

  // Initialize an empty invoice if navigated here without extracting
  useEffect(() => {
    if (!currentInvoice) {
      setCurrentInvoice({
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        vendorName: '',
        customerName: 'Invoice.ai Admin',
        items: [{ name: '', quantity: 1, price: 0, total: 0 }],
        totalAmount: 0,
        hasErrors: false
      });
    }
  }, [currentInvoice, setCurrentInvoice]);

  const handleExport = () => {
    if (!currentInvoice) return;
    generatePDF(currentInvoice);
  };

  const handleSmartAssist = () => {
    // Fill in blanks using mock AI
    if (!currentInvoice.invoiceNumber) updateField('invoiceNumber', `INV-AI-${Math.floor(Math.random() * 9999)}`);
    if (!currentInvoice.vendorName || currentInvoice.vendorName === 'Unknown Vendor') updateField('vendorName', 'Resolved Premium Co.');
    if (!currentInvoice.date) updateField('date', new Date().toISOString().split('T')[0]);
    updateField('hasErrors', false);
  };

  if (!currentInvoice) return null;

  const isError = (val) => currentInvoice.hasErrors && (!val || val === 'Unknown Vendor');

  return (
    <div 
      className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-6">
        <div>
          <FuzzyText className="text-3xl md:text-4xl mb-2">Invoice Builder</FuzzyText>
          <p className="text-gray-400">Manual review & edit node</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6 md:mt-0">
          <button 
             onClick={handleSmartAssist}
             className="px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 text-[#FFD700] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition flex items-center gap-2 font-semibold"
          >
             <Cpu className="w-5 h-5"/>
             Neural Suggest
          </button>
          <button 
             onClick={() => {
               useStore.getState().saveToHistory(currentInvoice);
               alert('Saved to invoice history successfully!');
             }}
             className="px-5 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-white/5 transition flex items-center gap-2 font-semibold"
          >
             Save
          </button>
          <GoldButton onClick={handleExport} icon={<FileDown className="w-5 h-5"/>}>
            Export PDF
          </GoldButton>
        </div>
      </div>

      {currentInvoice.hasErrors && (
         <div className="mb-8 p-4 bg-red-900/20 border border-red-500/40 rounded-2xl flex items-center gap-4 glow-red">
            <AlertCircle className="text-red-400 w-6 h-6 shrink-0"/>
            <span className="text-red-300 font-medium tracking-wide">
              Anomalies detected in the extracted data. Please review the highlighted fields below.
            </span>
         </div>
      )}

      {currentInvoice.fixLogs?.length > 0 && (
         <div className="mb-8 p-4 bg-green-900/10 border border-green-500/30 rounded-2xl glow-gold">
            <h4 className="text-green-400 font-semibold flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" /> AI Action Logs
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
               {currentInvoice.fixLogs.map((log, i) => (
                 <li key={i}>{log}</li>
               ))}
            </ul>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="glassmorphism p-6 rounded-3xl space-y-5">
           <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Header Details</h3>
           
           <div className="space-y-1.5 hover:text-[#FFD700] transition group relative">
             <label className="text-sm text-gray-400 font-medium">Invoice Number</label>
             <input 
               type="text" 
               value={currentInvoice.invoiceNumber}
               onChange={(e) => updateField('invoiceNumber', e.target.value)}
               className={`w-full bg-black/50 border rounded-xl px-4 py-2.5 outline-none transition-all placeholder-gray-600 focus:ring-1 
                 ${isError(currentInvoice.invoiceNumber) ? 'border-red-500 ring-red-500 box-shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'border-gray-700 focus:border-[#D4AF37] focus:ring-[#D4AF37]'}`}
               placeholder="INV-0000"
             />
             {isError(currentInvoice.invoiceNumber) && <span className="absolute right-3 top-9 text-red-500 p-1 w-2 h-2 rounded-full bg-red-500 animate-ping"/>}
           </div>

           <div className="space-y-1.5 focus-within:text-[#FFD700] transition">
             <label className="text-sm text-gray-400 font-medium">Date</label>
             <input 
               type="date"
               value={currentInvoice.date}
               onChange={(e) => updateField('date', e.target.value)}
               className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-gray-200"
             />
           </div>
        </div>

        <div className="glassmorphism p-6 rounded-3xl space-y-5">
           <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Entities</h3>

           <div className="space-y-1.5 relative">
             <label className="text-sm text-gray-400 font-medium">Vendor Name</label>
             <input 
               type="text" 
               value={currentInvoice.vendorName}
               onChange={(e) => updateField('vendorName', e.target.value)}
               className={`w-full bg-black/50 border rounded-xl px-4 py-2.5 outline-none transition-all placeholder-gray-600 focus:ring-1
                 ${isError(currentInvoice.vendorName) ? 'border-red-500/80 shadow-[0_0_15px_rgba(255,0,0,0.3)]' : 'border-gray-700 focus:border-[#D4AF37] focus:ring-[#D4AF37]'}`}
               placeholder="Vendor Inc."
             />
           </div>

           <div className="space-y-1.5">
             <label className="text-sm text-gray-400 font-medium">Customer Name</label>
             <input 
               type="text" 
               value={currentInvoice.customerName}
               onChange={(e) => updateField('customerName', e.target.value)}
               className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
               placeholder="Client Ltd."
             />
           </div>
        </div>
      </div>

      {/* Item List */}
      <div className="glassmorphism p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-[#D4AF37]">Line Items</h3>
           <button 
             onClick={addItem}
             className="text-sm text-[#FFD700] bg-[#FFD700]/10 px-4 py-2 rounded-lg font-semibold hover:bg-[#FFD700]/20 transition flex items-center gap-1.5"
           >
             <Plus className="w-4 h-4"/> Add Row
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="pb-3 px-2 w-1/2">Item Description</th>
                <th className="pb-3 px-2 w-24">Qty</th>
                <th className="pb-3 px-2 w-32">Price ($)</th>
                <th className="pb-3 px-2 w-32">Total ($)</th>
                <th className="pb-3 px-2 w-12 text-center">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
                {currentInvoice.items?.map((item, idx) => (
                  <tr 
                    key={idx}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2">
                       <input 
                         type="text" 
                         value={item.name} 
                         onChange={(e) => updateItem(idx, 'name', e.target.value)}
                         className="w-full bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1 placeholder-gray-600"
                         placeholder="Description"
                       />
                    </td>
                    <td className="py-3 px-2">
                       <input 
                         type="number" 
                         min="1"
                         value={item.quantity} 
                         onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                         className="w-full bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1"
                       />
                    </td>
                    <td className="py-3 px-2">
                       <input 
                         type="number" 
                         min="0"
                         step="0.01"
                         value={item.price} 
                         onChange={(e) => updateItem(idx, 'price', e.target.value)}
                         className="w-full bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1"
                       />
                    </td>
                    <td className="py-3 px-2 font-mono text-gray-300">
                       ${item.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center">
                       <button 
                         onClick={() => removeItem(idx)}
                         className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition opacity-0 group-hover:opacity-100"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-800 pt-6">
          <div className="w-64 space-y-3">
             <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${currentInvoice.totalAmount?.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-[#D4AF37] font-bold text-xl pt-3 border-t border-gray-800/80 glow-gold">
                <span>Grand Total</span>
                <span>${currentInvoice.totalAmount?.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
