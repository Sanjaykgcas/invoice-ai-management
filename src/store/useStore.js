import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: localStorage.getItem('auth') === 'true',
  login: () => {
    localStorage.setItem('auth', 'true');
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth');
    set({ isAuthenticated: false });
  },

  // UI Theme
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),

  // History State
  invoiceHistory: JSON.parse(localStorage.getItem('invoiceHistory') || '[]'),
  saveToHistory: (invoice) => set((state) => {
    const newHistory = [...state.invoiceHistory, { ...invoice, id: Date.now() }];
    localStorage.setItem('invoiceHistory', JSON.stringify(newHistory));
    return { invoiceHistory: newHistory };
  }),
  deleteFromHistory: (id) => set((state) => {
    const newHistory = state.invoiceHistory.filter(inv => inv.id !== id);
    localStorage.setItem('invoiceHistory', JSON.stringify(newHistory));
    return { invoiceHistory: newHistory };
  }),

  // Invoice Data State
  currentInvoice: null,
  setCurrentInvoice: (invoiceData) => set({ currentInvoice: invoiceData }),
  updateInvoiceField: (field, value) => set((state) => ({
    currentInvoice: { ...state.currentInvoice, [field]: value }
  })),
  updateInvoiceItem: (index, field, value) => set((state) => {
    const newItems = [...state.currentInvoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    // auto-recalc total for item if quantity or price changed
    if (field === 'quantity' || field === 'price') {
      const q = parseFloat(newItems[index].quantity) || 0;
      const p = parseFloat(newItems[index].price) || 0;
      newItems[index].total = q * p;
    }
    
    // auto-recalc grand total
    const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    return {
      currentInvoice: { ...state.currentInvoice, items: newItems, totalAmount }
    };
  }),
  addItem: () => set((state) => ({
    currentInvoice: {
      ...state.currentInvoice,
      items: [...state.currentInvoice.items, { name: '', quantity: 1, price: 0, total: 0 }],
      hasErrors: true // Just a flag to signify edit mode might have changed things
    }
  })),
  removeItem: (index) => set((state) => {
    const newItems = state.currentInvoice.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    return {
      currentInvoice: { ...state.currentInvoice, items: newItems, totalAmount }
    };
  })
}));

export default useStore;
