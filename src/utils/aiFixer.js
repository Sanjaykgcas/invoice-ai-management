/**
 * Simulate AI reasoning to fix missing or incorrectly formatted invoice data
 */
export const autoFixInvoice = async (invoiceData) => {
  return new Promise((resolve) => {
    // Simulate API delay for RPA/AI
    setTimeout(() => {
      let fixedData = { ...invoiceData };
      let logs = [];

      // Fix Invoice Number
      if (!fixedData.invoiceNumber || fixedData.invoiceNumber.length < 3) {
        fixedData.invoiceNumber = `INV-AI-${Math.floor(Math.random() * 9999)}`;
        logs.push(`AI automatically generated missing Invoice Number: ${fixedData.invoiceNumber}`);
      }

      // Fix Vendor Name
      if (fixedData.vendorName === 'Unknown Vendor' || !fixedData.vendorName) {
        fixedData.vendorName = 'Extracted Enterprise LLc.';
        logs.push(`AI recognized and substituted Vendor Name: ${fixedData.vendorName}`);
      }

      // Fix Date
      if (!fixedData.date) {
        const today = new Date().toISOString().split('T')[0];
        fixedData.date = today;
        logs.push(`AI set missing Date to fallback (Today): ${today}`);
      }

      // Fix Items
      if (!fixedData.items || fixedData.items.length === 0) {
        fixedData.items = [
          { name: 'General Cloud Services', quantity: 1, price: 1000, total: 1000 }
        ];
        logs.push(`AI structured missing items based on context.`);
      }

      // Recalculate totals
      const newTotal = fixedData.items.reduce((sum, current) => sum + current.total, 0);
      if (fixedData.totalAmount !== newTotal) {
         logs.push(`AI corrected Total Amount from ${fixedData.totalAmount} to ${newTotal}`);
         fixedData.totalAmount = newTotal;
      }

      fixedData.hasErrors = false;
      fixedData.fixLogs = logs;

      resolve(fixedData);
    }, 1500); // 1.5s simulated processing
  });
};
