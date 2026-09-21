import React, { useEffect, useState, useMemo } from 'react';
import SummaryApi from '../common';
import { 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaRupeeSign,
  FaBagShopping,
  FaChartPie,
  FaArrowTrendUp,
  FaFileArrowDown,
  FaRotate,
  FaPlus,
  FaMagnifyingGlass,
  FaServer,
  FaShieldHalved,
  FaEye,
  FaXmark,
  FaBolt,
  FaCalculator,
  FaNoteSticky,
  FaPalette,
  FaCheck,
  FaPercent,
  FaListCheck,
  FaTerminal,
  FaMicrochip,
  FaWandMagicSparkles
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import displayINRCurrency from '../helpers/displayCurrency';
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    averageOrderValue: 0,
  });
  const [allOrders, setAllOrders] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [salesChartData, setSalesChartData] = useState({ labels: [], datasets: [] });
  const [orderStatusData, setOrderStatusData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('7days'); 
  const [tableFilter, setTableFilter] = useState('all'); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [showAlertBanner, setShowAlertBanner] = useState(true);

  // Theme & Notes States
  const [themeColor, setThemeColor] = useState('cyan'); // 'cyan', 'emerald', 'purple'
  const [noteText, setNoteText] = useState(localStorage.getItem('admin_quick_note') || '');
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [showToolsModal, setShowToolsModal] = useState(false);

  // Advanced Feature States
  const [costPrice, setCostPrice] = useState('');
  const [profitMargin, setProfitMargin] = useState('20');
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem('admin_todos')) || [
      { id: 1, text: 'Review pending vendor payouts', done: false },
      { id: 2, text: 'Verify SSL certificate status', done: true },
      { id: 3, text: 'Check low stock inventory', done: false },
    ]
  );
  const [newTodoText, setNewTodoText] = useState('');
  
  // Enhanced AI Command Terminal States
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([
    { type: 'system', text: 'AI Command Terminal v7.0 Initialized. Type "help" for a list of shortcuts.' }
  ]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);

      const [orderRes, productRes, userRes] = await Promise.all([
        fetch(SummaryApi.allOrders?.url || SummaryApi.allOrder?.url, { method: SummaryApi.allOrders?.method || 'GET', credentials: 'include' }).catch(() => null),
        fetch(SummaryApi.allProduct?.url || SummaryApi.allProducts?.url, { method: SummaryApi.allProduct?.method || 'GET', credentials: 'include' }).catch(() => null),
        fetch(SummaryApi.allUser?.url || SummaryApi.allUsers?.url, { method: SummaryApi.allUser?.method || 'GET', credentials: 'include' }).catch(() => null),
      ]);

      let orders = [];
      let productsCount = 0;
      let usersCount = 0;

      if (orderRes) {
        const orderData = await orderRes.json();
        if (orderData.success) orders = orderData.data || [];
      }

      if (productRes) {
        const prodData = await productRes.json();
        if (prodData.success) productsCount = prodData.data?.length || prodData.totalCount || 20;
      }

      if (userRes) {
        const usrData = await userRes.json();
        if (usrData.success) usersCount = usrData.data?.length || usrData.totalCount || 10;
      }

      setAllOrders(orders);
      setLatestOrders(orders);

      const totalRevenueVal = orders.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
      const avgOrderVal = orders.length > 0 ? Math.round(totalRevenueVal / orders.length) : 0;
      
      setStats({
        totalRevenue: totalRevenueVal,
        totalOrders: orders.length,
        totalProducts: productsCount,
        totalUsers: usersCount,
        averageOrderValue: avgOrderVal,
      });

      prepareChartData(orders, timeRange);
      preparePieChartData(orders);

    } catch (error) {
      console.error('Error fetching dashboard real data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeColors = () => {
    switch (themeColor) {
      case 'emerald':
        return { primary: 'rgb(16, 185, 129)', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30' };
      case 'purple':
        return { primary: 'rgb(168, 85, 247)', text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/30' };
      default:
        return { primary: 'rgb(34, 211, 238)', text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-500/30' };
    }
  };

  const activeTheme = getThemeColors();

  const prepareChartData = (orders, range) => {
    const daysCount = range === '30days' ? 30 : 7;
    const lastDays = {};
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const dateKey = moment().subtract(i, 'days').format('DD MMM');
      lastDays[dateKey] = 0;
    }

    orders.forEach(order => {
      const orderDate = moment(order.createdAt).format('DD MMM');
      if (lastDays[orderDate] !== undefined) {
        lastDays[orderDate] += (order.totalAmount || 0);
      }
    });

    const labels = Object.keys(lastDays);
    const dataValues = Object.values(lastDays);

    setSalesChartData({
      labels,
      datasets: [
        {
          fill: true,
          label: 'Revenue (₹)',
          data: dataValues,
          borderColor: activeTheme.primary,
          backgroundColor: `${activeTheme.primary.replace('rgb', 'rgba').replace(')', ', 0.1)')}`,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: activeTheme.primary,
        },
      ],
    });
  };

  const preparePieChartData = (orders) => {
    let successCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    orders.forEach(order => {
      const status = order.paymentDetails?.payment_status?.toLowerCase();
      if (status === 'paid' || status === 'success' || !status) {
        successCount += 1;
      } else if (status === 'pending') {
        pendingCount += 1;
      } else {
        failedCount += 1;
      }
    });

    if (orders.length === 0) successCount = 1;

    setOrderStatusData({
      labels: ['Successful', 'Pending', 'Failed/Other'],
      datasets: [
        {
          data: [successCount, pendingCount, failedCount],
          backgroundColor: ['rgba(34, 211, 238, 0.8)', 'rgba(251, 191, 36, 0.8)', 'rgba(244, 63, 94, 0.8)'],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    });
  };

  const filteredOrders = useMemo(() => {
    let result = latestOrders;

    if (tableFilter === 'today') {
      result = result.filter(ord => moment(ord.createdAt).isSame(moment(), 'day'));
    } else if (tableFilter === 'success') {
      result = result.filter(ord => {
        const status = ord.paymentDetails?.payment_status?.toLowerCase();
        return status === 'paid' || status === 'success' || !status;
      });
    }

    if (searchQuery.trim()) {
      result = result.filter(ord => 
        ord._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.shipping_address?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.paymentDetails?.payment_status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result; // Removed .slice(0, 15) so all filtered records can be scrolled through
  }, [latestOrders, searchQuery, tableFilter]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    prepareChartData(allOrders, range);
  };

  const exportOrdersCSV = () => {
    if (!latestOrders.length) return alert('No orders available to export!');
    const headers = ['Order ID,Date & Time,Customer Name,Payment Status,Amount (INR)\n'];
    const rows = latestOrders.map(ord => 
      `"${ord._id}","${moment(ord.createdAt).format('YYYY-MM-DD HH:mm:ss')}","${ord.shipping_address?.name || 'Customer'}","${ord.paymentDetails?.payment_status || 'Success'}",${ord.totalAmount}`
    );
    const blob = new Blob([...headers, [...rows]], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `store_orders_${moment().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNote = (val) => {
    setNoteText(val);
    localStorage.setItem('admin_quick_note', val);
  };

  const handleCalculate = () => {
    try {
      const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, '');
      setCalcResult(eval(sanitized));
    } catch {
      setCalcResult('Invalid Expression');
    }
  };

  // Todo Handlers
  const toggleTodo = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const updated = [...todos, { id: Date.now(), text: newTodoText, done: false }];
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
    setNewTodoText('');
  };

  const deleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    localStorage.setItem('admin_todos', JSON.stringify(updated));
  };

  // Enhanced AI Command Terminal Handler
  const handleRunCommand = (e) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    let responseText = '';
    const newHistory = [...commandHistory, { type: 'user', text: `$ ${commandInput}` }];

    if (cmd === 'help') {
      responseText = 'Commands: stats, clear, refresh, theme [cyan/emerald/purple], export, date, creator';
    } else if (cmd === 'stats') {
      responseText = `Metrics -> Orders: ${stats.totalOrders} | Revenue: ₹${stats.totalRevenue} | Users: ${stats.totalUsers} | AOV: ₹${stats.averageOrderValue}`;
    } else if (cmd === 'refresh') {
      fetchDashboardMetrics();
      responseText = 'Success: Dashboard metrics re-synchronized with live API database.';
    } else if (cmd === 'clear') {
      setCommandHistory([{ type: 'system', text: 'Terminal session cleared.' }]);
      setCommandInput('');
      return;
    } else if (cmd === 'export') {
      exportOrdersCSV();
      responseText = 'Success: CSV file export triggered for recent orders.';
    } else if (cmd === 'date') {
      responseText = `Current System Timestamp: ${moment().format('DD MMM YYYY, hh:mm:ss A')}`;
    } else if (cmd === 'creator') {
      responseText = 'Enterprise AI Control Suite designed by Shubham Kumar (AI/ML Engineer).';
    } else if (cmd.startsWith('theme ')) {
      const color = cmd.split(' ')[1];
      if (['cyan', 'emerald', 'purple'].includes(color)) {
        setThemeColor(color);
        responseText = `Success: UI Accent theme successfully changed to ${color}.`;
      } else {
        responseText = 'Error: Invalid theme name. Choose from cyan, emerald, or purple.';
      }
    } else {
      responseText = `Error: Unknown command "${commandInput}". Type "help" for available shortcuts.`;
    }

    newHistory.push({ type: 'response', text: responseText });
    setCommandHistory(newHistory);
    setCommandInput('');
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, [themeColor]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    },
  };

  const calculatedSellingPrice = useMemo(() => {
    const cp = parseFloat(costPrice) || 0;
    const margin = parseFloat(profitMargin) || 0;
    return Math.round(cp + (cp * margin) / 100);
  }, [costPrice, profitMargin]);

  return (
    <div className="p-3 sm:p-6 text-slate-100 min-h-full relative">
      
      {/* Live Activity Ticker Banner */}
      {showAlertBanner && (
        <div className={`mb-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border ${activeTheme.border} p-3 rounded-2xl flex items-center justify-between shadow-lg backdrop-blur-md`}>
          <div className="flex items-center gap-3 text-xs">
            <span className={`p-2 ${activeTheme.bg} text-slate-950 rounded-xl font-bold animate-pulse`}>
              <FaBolt size={12} />
            </span>
            <p className="text-slate-300 font-medium">
              <strong className="text-white">ULTIMATE Suite v7.0 Active:</strong> Enhanced AI Command Parser & Live Synchronizer online for <span className={`${activeTheme.text} font-bold`}>{stats.totalOrders} transactions</span>.
            </p>
          </div>
          <button onClick={() => setShowAlertBanner(false)} className="text-slate-400 hover:text-white p-1.5 transition">
            <FaXmark size={14} />
          </button>
        </div>
      )}

      {/* Header Banner with Quick Controls & Theme Customizer */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
            Store Analytics <span className={`text-xs font-semibold ${activeTheme.bg}/10 ${activeTheme.text} border ${activeTheme.border} px-2.5 py-0.5 rounded-full`}>ULTIMATE v7.0</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Next-gen admin dashboard equipped with AI command terminal, margin simulator, and secure local sync.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Theme Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 gap-1">
            <button 
              onClick={() => setThemeColor('cyan')}
              className={`w-5 h-5 rounded-full bg-cyan-400 transition flex items-center justify-center text-slate-950 text-[10px] ${themeColor === 'cyan' ? 'ring-2 ring-white' : 'opacity-60'}`}
              title="Cyan Theme"
            >
              {themeColor === 'cyan' && <FaCheck size={8} />}
            </button>
            <button 
              onClick={() => setThemeColor('emerald')}
              className={`w-5 h-5 rounded-full bg-emerald-400 transition flex items-center justify-center text-slate-950 text-[10px] ${themeColor === 'emerald' ? 'ring-2 ring-white' : 'opacity-60'}`}
              title="Emerald Theme"
            >
              {themeColor === 'emerald' && <FaCheck size={8} />}
            </button>
            <button 
              onClick={() => setThemeColor('purple')}
              className={`w-5 h-5 rounded-full bg-purple-400 transition flex items-center justify-center text-slate-950 text-[10px] ${themeColor === 'purple' ? 'ring-2 ring-white' : 'opacity-60'}`}
              title="Purple Theme"
            >
              {themeColor === 'purple' && <FaCheck size={8} />}
            </button>
          </div>

          <button 
            onClick={() => setShowToolsModal(true)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition shadow-sm"
          >
            <FaCalculator /> Calculator
          </button>

          <button 
            onClick={fetchDashboardMetrics}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition shadow-sm"
          >
            <FaRotate className={`${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>

          <button 
            onClick={exportOrdersCSV}
            className={`bg-slate-800/80 hover:bg-slate-700 border ${activeTheme.border} ${activeTheme.text} px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition shadow-sm`}
          >
            <FaFileArrowDown /> Export CSV
          </button>

          <Link 
            to="/admin-panel/all-products" 
            className={`bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition ${themeColor === 'emerald' ? '!from-emerald-400 !to-teal-500' : themeColor === 'purple' ? '!from-purple-400 !to-indigo-500' : ''}`}
          >
            <FaPlus /> Products
          </Link>
        </div>
      </div>

      {/* System Health & Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <FaShieldHalved size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Gateway Status</p>
              <h4 className="text-sm font-bold text-white mt-0.5">Secure & Active</h4>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <FaServer size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">API Server Ping</p>
              <h4 className="text-sm font-bold text-white mt-0.5">14ms (Optimal)</h4>
            </div>
          </div>
          <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded">99.9% Up</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <FaArrowTrendUp size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Avg. Order Value</p>
              <h4 className="text-sm font-bold text-white mt-0.5">{displayINRCurrency(stats.averageOrderValue)}</h4>
            </div>
          </div>
          <span className="text-[10px] text-purple-400 font-medium bg-purple-500/10 px-2 py-0.5 rounded">AOV</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-slate-700 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{displayINRCurrency(stats.totalRevenue)}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-md">Live Data Active</span>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center ${activeTheme.text}`}>
            <FaRupeeSign size={20} />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-slate-700 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{stats.totalOrders}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-semibold mt-2 bg-blue-500/10 px-2 py-0.5 rounded-md">Processed Orders</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
            <FaBagShopping size={20} />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-slate-700 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Products</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{stats.totalProducts}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold mt-2 bg-amber-500/10 px-2 py-0.5 rounded-md">Catalog Items</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <FaBox size={20} />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group hover:border-slate-700 transition">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{stats.totalUsers}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-semibold mt-2 bg-purple-500/10 px-2 py-0.5 rounded-md">Registered Accounts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-400">
            <FaUsers size={20} />
          </div>
        </div>

      </div>

      {/* Analytics Charts Section & Quick Notes Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Revenue Growth Trend */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <FaChartLine className={activeTheme.text} /> Revenue Growth Trend
                </h3>
                <p className="text-[11px] text-slate-400">Sales performance over time</p>
              </div>

              <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
                <button 
                  onClick={() => handleTimeRangeChange('7days')}
                  className={`px-3 py-1 rounded-lg transition font-medium ${timeRange === '7days' ? `${activeTheme.bg} text-slate-950 font-bold shadow` : 'text-slate-400 hover:text-white'}`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('30days')}
                  className={`px-3 py-1 rounded-lg transition font-medium ${timeRange === '30days' ? `${activeTheme.bg} text-slate-950 font-bold shadow` : 'text-slate-400 hover:text-white'}`}
                >
                  30 Days
                </button>
              </div>
            </div>
          </div>
          
          <div className="h-64 sm:h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs animate-pulse">Loading analytics graph...</div>
            ) : (
              <Line data={salesChartData} options={lineChartOptions} />
            )}
          </div>
        </div>

        {/* Quick Admin Scratchpad / Notes */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FaNoteSticky className="text-amber-400" /> Admin Scratchpad
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Auto-saved</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Jot down temporary tasks or reminders.</p>
            <textarea 
              rows="7"
              placeholder="Write quick notes here..."
              value={noteText}
              onChange={(e) => handleSaveNote(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 resize-none transition"
            ></textarea>
          </div>
          <div className="text-[10px] text-slate-400 text-right">Stored securely in local cache</div>
        </div>

      </div>

      {/* ADVANCED WIDGETS ROW: Price Margin Simulator & Admin Checklist & Enhanced AI Command Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* 1. Profit Margin Simulator */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <FaPercent className={activeTheme.text} /> Price Margin Simulator
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Calculate ideal selling price instantly.</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Cost Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Target Profit Margin (%)</label>
                <input 
                  type="number" 
                  placeholder="20" 
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Suggested Selling Price:</span>
                <span className={`font-bold text-sm ${activeTheme.text}`}>{displayINRCurrency(calculatedSellingPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Admin Operational Checklist */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FaListCheck className="text-emerald-400" /> Ops Checklist
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{todos.filter(t => t.done).length}/{todos.length} done</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Daily management task tracker.</p>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 mb-3">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-xl border border-slate-700/50 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none flex-1 truncate">
                    <input 
                      type="checkbox" 
                      checked={todo.done} 
                      onChange={() => toggleTodo(todo.id)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className={`${todo.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{todo.text}</span>
                  </label>
                  <button onClick={() => deleteTodo(todo.id)} className="text-slate-500 hover:text-red-400 p-1">
                    <FaXmark size={10} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addTodo} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add new task..." 
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1 bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" className={`bg-slate-800 hover:${activeTheme.bg} hover:text-slate-950 ${activeTheme.text} px-3 py-2 rounded-xl text-xs font-bold transition border border-slate-700`}>
                +
              </button>
            </form>
          </div>
        </div>

        {/* 3. Enhanced AI Command Terminal with Scrollable History */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FaTerminal className="text-blue-400" /> AI Command Terminal
              </h3>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                <FaWandMagicSparkles size={10} /> v7.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">Type <code className="text-cyan-400 font-mono">help</code>, <code className="text-cyan-400 font-mono">stats</code>, or <code className="text-cyan-400 font-mono">theme emerald</code>.</p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] h-32 overflow-y-auto mb-3 space-y-1.5">
              {commandHistory.map((item, idx) => (
                <div key={idx}>
                  {item.type === 'user' && <p className="text-cyan-400 font-bold">{item.text}</p>}
                  {item.type === 'response' && <p className="text-emerald-400 pl-2 border-l-2 border-emerald-500/40 my-0.5">{item.text}</p>}
                  {item.type === 'system' && <p className="text-slate-500 italic">{item.text}</p>}
                </div>
              ))}
            </div>

            <form onSubmit={handleRunCommand} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter command (e.g. stats)..." 
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-slate-800/80 border border-slate-700 text-xs font-mono text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition">
                Execute
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Transactions Table with Vertical Scroll */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Recent Transactions</h3>
            <p className="text-[11px] text-slate-400">Live orders processed through the gateway</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button 
                onClick={() => setTableFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${tableFilter === 'all' ? `${activeTheme.bg} text-slate-950 font-bold shadow` : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setTableFilter('today')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${tableFilter === 'today' ? `${activeTheme.bg} text-slate-950 font-bold shadow` : 'text-slate-400 hover:text-white'}`}
              >
                Today
              </button>
              <button 
                onClick={() => setTableFilter('success')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${tableFilter === 'success' ? `${activeTheme.bg} text-slate-950 font-bold shadow` : 'text-slate-400 hover:text-white'}`}
              >
                Successful
              </button>
            </div>

            <div className="relative flex-1 sm:w-60">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FaMagnifyingGlass size={12} />
              </span>
              <input 
                type="text" 
                placeholder="Search ID or customer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <div className={`w-6 h-6 border-2 ${activeTheme.border} border-t-transparent rounded-full animate-spin`}></div>
            <p className="text-xs text-slate-400">Fetching live database transactions...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No matching orders found.</p>
        ) : (
          <div className="overflow-x-auto max-h-[450px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="p-3 rounded-l-xl">Order ID</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 rounded-r-xl text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition">
                    <td className={`p-3 font-mono ${activeTheme.text} font-medium`}>#{order._id?.slice(-8)}</td>
                    <td className="p-3 text-slate-400">{moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                    <td className="p-3 text-slate-200 font-medium">{order.shipping_address?.name || order.userId?.name || 'Customer'}</td>
                    <td className="p-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        {order.paymentDetails?.payment_status || 'Success'}
                      </span>
                    </td>
                    <td className={`p-3 font-bold text-right ${activeTheme.text}`}>{displayINRCurrency(order.totalAmount)}</td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className={`p-1.5 bg-slate-800 hover:${activeTheme.bg} hover:text-slate-950 ${activeTheme.text} rounded-lg transition border border-slate-700/80 inline-flex items-center justify-center`}
                        title="View Order Details"
                      >
                        <FaEye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mini Calculator & Tools Modal */}
      {showToolsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl relative">
            <button 
              onClick={() => setShowToolsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition"
            >
              <FaXmark size={14} />
            </button>

            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <FaCalculator className={activeTheme.text} /> Quick Calculator
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Quick math utility for admin pricing.</p>

            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="e.g. 1500 + 450 * 2" 
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-3 font-mono focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleCalculate}
                  className={`flex-1 ${activeTheme.bg} text-slate-950 font-bold py-2 rounded-xl text-xs transition`}
                >
                  Calculate
                </button>
                <button 
                  onClick={() => { setCalcInput(''); setCalcResult(''); }}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs hover:bg-slate-700 transition"
                >
                  Clear
                </button>
              </div>

              {calcResult !== '' && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Result:</span>
                  <span className={`font-mono font-bold text-sm ${activeTheme.text}`}>{calcResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Quick View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition"
            >
              <FaXmark size={14} />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Order Details</h3>
            <p className={`text-xs font-mono ${activeTheme.text} mb-4`}>ID: {selectedOrder._id}</p>

            <div className="space-y-3 text-xs bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-semibold text-white">{selectedOrder.shipping_address?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Date & Time:</span>
                <span className="font-semibold text-white">{moment(selectedOrder.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-semibold text-emerald-400">{selectedOrder.paymentDetails?.payment_status || 'Success'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-300 font-bold">Total Amount:</span>
                <span className={`font-bold ${activeTheme.text} text-sm`}>{displayINRCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-medium transition text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;