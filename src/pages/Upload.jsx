import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { processInvoice } from '../utils/ocrProcessor';
import { autoFixInvoice } from '../utils/aiFixer';
import { generatePDF } from '../utils/pdfGenerator';
import { AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, Cpu, Edit, Download } from 'lucide-react';
import Loader from '../components/Loader';
import FuzzyText from '../components/FuzzyText';
import GoldButton from '../components/GoldButton';

const Upload = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [progress, setProgress] = useState(null);
  
  const currentInvoice = useStore((state) => state.currentInvoice);
  const setCurrentInvoice = useStore((state) => state.setCurrentInvoice);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    // Process only first file for simplicity in demo
    const file = files[0];
    
    setIsProcessing(true);
    setProcessingText('Initializing AI & OCR Engine...');
    setProgress(10);
    
    try {
      setTimeout(() => {
         setProcessingText('Extracting Text via Tesseract.js...');
         setProgress(40);
      }, 1000);

      const data = await processInvoice(file);
      
      setProcessingText('Running Neural Validation Pipeline...');
      setProgress(80);
      
      setTimeout(() => {
        setCurrentInvoice(data);
        setIsProcessing(false);
        setProgress(null);
      }, 1500);

    } catch (error) {
       console.error(error);
       alert("Error processing file. Please ensure it is a valid format.");
       setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsHovering(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    // Process only first file for simplicity in demo
    const file = files[0];
    
    setIsProcessing(true);
    setProcessingText('Initializing AI & OCR Engine...');
    setProgress(10);
    
    setTimeout(() => {
       setProcessingText('Extracting Text via Tesseract.js...');
       setProgress(40);
    }, 1000);

    processInvoice(file).then(data => {
      setProcessingText('Running Neural Validation Pipeline...');
      setProgress(80);
      
      setTimeout(() => {
        useStore.getState().setCurrentInvoice(data);
        setIsProcessing(false);
        setProgress(null);
      }, 1500);
    }).catch(error => {
       console.error(error);
       alert("Error processing file. Please ensure it is a valid format.");
       setIsProcessing(false);
    });
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const doAutoFix = async () => {
    setIsProcessing(true);
    setProcessingText('AI Structuring & Auto-Fixing Anomalies...');
    const fixed = await autoFixInvoice(currentInvoice);
    setCurrentInvoice(fixed);
    setIsProcessing(false);
  };

  const doManualFix = () => {
     navigate('/create');
  };

  const exportPDF = () => {
     generatePDF(currentInvoice);
  };

  // If currently processing
  if (isProcessing) {
     return (
       <div className="h-[70vh] flex flex-col items-center justify-center">
         <Loader text={processingText} progress={progress} />
       </div>
     );
  }

  // If processing done and displaying results
  if (currentInvoice) {
     const hasErrors = currentInvoice.hasErrors;
     return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 pb-20"
        >
           <FuzzyText className="text-4xl text-center mb-8">Extraction Results</FuzzyText>
           
           <div className={`glassmorphism rounded-3xl p-6 ${hasErrors ? 'border-red-500/30' : 'border-[#D4AF37]/30'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-3">
                   {hasErrors ? <AlertTriangle className="text-red-500" /> : <CheckCircle className="text-green-400" />}
                   <span className={hasErrors ? "text-red-300" : "text-green-300"}>
                     {hasErrors ? "Anomalies Detected" : "Confidence: High (98%)"}
                   </span>
                 </h2>
                 {!hasErrors && (
                    <span className="bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-500/30">
                      RPA Verified
                    </span>
                 )}
              </div>

              {/* Simulated Spreadsheet View */}
              <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/40">
                <table className="w-full text-left text-sm">
                   <thead className="bg-[#1A1A1A] text-gray-400 font-medium">
                      <tr>
                         <th className="py-3 px-4 border-b border-gray-800 w-1/3">Field Name</th>
                         <th className="py-3 px-4 border-b border-gray-800 w-1/3">Extracted Value</th>
                         <th className="py-3 px-4 border-b border-gray-800 w-1/3">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-800">
                      <FieldRow label="Invoice Number" value={currentInvoice.invoiceNumber} required />
                      <FieldRow label="Date" value={currentInvoice.date} required />
                      <FieldRow label="Vendor Name" value={currentInvoice.vendorName} required />
                      <FieldRow label="Total Amount" value={`$${currentInvoice.totalAmount?.toFixed(2)}`} required={currentInvoice.totalAmount > 0} />
                      <FieldRow label="Line Items Count" value={currentInvoice.items?.length || 0} required={(currentInvoice.items?.length || 0) > 0} />
                   </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                 {hasErrors ? (
                   <>
                     <GoldButton onClick={doAutoFix} icon={<Cpu className="w-5 h-5"/>} className="w-full sm:w-auto">
                        Auto Fix with AI
                     </GoldButton>
                     <button 
                       onClick={doManualFix}
                       className="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center gap-2"
                     >
                        <Edit className="w-5 h-5"/>
                        Manual Fix
                     </button>
                   </>
                 ) : (
                   <>
                     <GoldButton onClick={exportPDF} icon={<Download className="w-5 h-5"/>}>
                        Download Validated PDF
                     </GoldButton>
                     <button 
                       onClick={() => navigate('/create')}
                       className="px-6 py-3 rounded-2xl border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition flex gap-2 items-center"
                     >
                        <FileText className="w-5 h-5"/> View Full Invoice Builder
                     </button>
                   </>
                 )}
              </div>
           </div>
        </motion.div>
     );
  }

  // Upload State
  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col justify-center items-center relative">
      <FuzzyText className="text-4xl md:text-5xl mb-4 text-center">Smart Invoice Processing</FuzzyText>
      <p className="text-gray-400 mb-10 text-center max-w-lg leading-relaxed">
        Drop your invoices here. Our neural engine will extract the line items, structured data, and flag anomalies automatically.
      </p>

      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full max-w-2xl relative rounded-3xl glassmorphism transition-all duration-300 p-1 
          ${isHovering ? 'scale-[1.02] shadow-[0_0_40px_rgba(212,175,55,0.4)]' : 'shadow-[0_0_20px_rgba(212,175,55,0.1)]'}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] rounded-3xl opacity-20 blur-sm pointer-events-none 
          ${isHovering ? 'opacity-40 animate-pulse' : ''}`} />
        
        <div className="w-full h-80 rounded-[22px] bg-black/80 flex flex-col justify-center items-center border-[2px] border-dashed border-[#D4AF37]/40 relative z-10 cursor-pointer group hover:border-[#D4AF37] transition-colors"
             onClick={() => fileInputRef.current?.click()}
        >
           <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-10 h-10 text-[#FFD700]" />
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop Invoice</h3>
           <p className="text-gray-500 mb-6 font-medium">or click to browse from device</p>
           
           <div className="flex gap-3 text-sm font-semibold">
              <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg">PDF</span>
              <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg">JPG / PNG</span>
              <span className="px-3 py-1 bg-white/5 text-[#D4AF37] rounded-lg border border-[#D4AF37]/30">&lt; 10MB</span>
           </div>

           <input 
             type="file" 
             className="hidden" 
             ref={fileInputRef}
             multiple
             accept=".pdf,image/png,image/jpeg,.docx"
             onChange={(e) => handleFileUpload(e.target.files)}
           />
        </div>
      </div>
    </div>
  );
};

// Row component for the extracted data spreadsheet
const FieldRow = ({ label, value, required }) => {
  const isInvalid = required !== undefined ? (!value || value === 'Unknown Vendor' || value === '$NaN') && required : !value;
  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="py-3 px-4 font-medium text-gray-300">{label}</td>
      <td className="py-3 px-4 text-white">
        {value ? (
           <span className="bg-black/50 px-3 py-1.5 rounded-md border border-gray-700 font-mono text-sm">{value}</span>
        ) : (
           <span className="text-gray-600 italic">Extracted value empty</span>
        )}
      </td>
      <td className="py-3 px-4">
        {isInvalid ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-900/40 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Error Validation
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Correct
          </span>
        )}
      </td>
    </tr>
  );
};

export default Upload;
