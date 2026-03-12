import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderList from '../../components/OrderList';
import { fetchAdminOrders } from '../../redux/Orderslice';
import Select from '../../components/UI/Select';
import Button from '../../components/UI/Button';
import { ChevronLeft, ChevronRight, ClipboardList, Package, Search, SlidersHorizontal } from 'lucide-react';

const Allorderpage = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminTotalPages, loading, error } = useSelector(state => state.order);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminOrders(page));
  }, [dispatch, page]);

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (page < adminTotalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter orders
  let displayedOrders = [...(adminOrders || [])];

  if (searchQuery) {
    const term = searchQuery.toLowerCase();
    displayedOrders = displayedOrders.filter((order) =>
      order._id.toLowerCase().includes(term) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(term) ||
      order.shippingAddress?.email?.toLowerCase().includes(term)
    );
  }

  if (statusFilter !== 'all') {
    displayedOrders = displayedOrders.filter((order) => {
      if (statusFilter === 'paid') return order.paymentMode !== 'COD';
      if (statusFilter === 'cod') return order.paymentMode === 'COD';
      return true;
    });
  }

  // Stats
  const totalRevenue = displayedOrders.reduce((sum, o) => sum + (o.finalPrice || 0), 0);

  return (
    <div className="p-5 sm:p-6 lg:p-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Order <span className="text-[var(--primary)]">Management</span>
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Track and manage all customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--primary-light)] px-3 py-2 rounded-xl">
            <ClipboardList size={16} className="text-[var(--primary)]" />
            <span className="text-sm font-bold text-[var(--primary)]">{adminOrders?.length || 0}</span>
            <span className="text-xs text-[var(--primary)] font-medium">Orders</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--accent-light)] px-3 py-2 rounded-xl">
            <span className="text-sm font-bold text-[var(--accent)]">₹{totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-[var(--accent)] font-medium">Revenue</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] shadow-sm mb-6">
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by order ID, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-body)] text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(15,76,129,0.08)] transition-all w-full"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
              showFilters || statusFilter !== 'all'
                ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light)]'
                : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {statusFilter !== 'all' && (
              <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[10px] flex items-center justify-center">1</span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="px-4 py-3 border-t border-[var(--border-light)] flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-1 duration-200">
            <div className="flex-1 max-w-xs">
              <Select
                label="Payment Type"
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                options={[
                  { value: 'all', label: 'All Orders' },
                  { value: 'paid', label: 'Prepaid' },
                  { value: 'cod', label: 'Cash on Delivery' },
                ]}
              />
            </div>
            {statusFilter !== 'all' && (
              <div className="flex items-end">
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-5 py-3.5 border-b border-[var(--border-light)] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-main)]">Recent Orders</h3>
          <span className="text-xs font-medium text-[var(--text-muted)]">
            Page {page} of {adminTotalPages || 1}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--primary-light)] border-t-[var(--primary)]" />
            <span className="text-xs text-[var(--text-muted)]">Fetching orders...</span>
          </div>
        ) : error ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <Button onClick={() => dispatch(fetchAdminOrders(page))} variant="outline" size="sm">Retry</Button>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            <Package size={32} strokeWidth={1.5} className="text-slate-300" />
            <span className="text-sm font-medium">No orders found</span>
            <span className="text-xs">
              {searchQuery || statusFilter !== 'all' ? "Try adjusting your filters." : "Orders will appear here."}
            </span>
          </div>
        ) : (
          <>
            <OrderList orders={displayedOrders} role="admin" />

            {/* Pagination */}
            {adminTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 p-4 border-t border-[var(--border-light)] bg-[var(--bg-body)]/50">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(adminTotalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        page === i + 1
                          ? 'bg-[var(--primary)] text-white shadow-sm'
                          : 'text-[var(--text-muted)] hover:bg-[var(--border-light)]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={page === adminTotalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Allorderpage;
