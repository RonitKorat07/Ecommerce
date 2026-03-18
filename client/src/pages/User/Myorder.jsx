import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderList from '../../components/OrderList';
import { fetchUserOrders } from '../../redux/Orderslice';
import { ClipboardList, ShoppingBag } from 'lucide-react';
import { Card, CardBody } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const Myorder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userOrders, loading, error } = useSelector(state => state.order);
  const user = useSelector((state) => state.user.user);

  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, userId]);

  return (
    <div className="max-w-[1024px] mx-auto p-4 md:p-6 space-y-4 animate-in fade-in duration-500" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-lg md:text-xl font-bold text-[var(--text-main)] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <ClipboardList size={20} className="text-[var(--primary)]" />
          My <span className="text-[var(--primary)]">Orders</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-medium">Manage and track your recent purchases.</p>
      </div>

      <Card className="border border-[var(--border-light)] shadow-sm overflow-hidden bg-white rounded-xl">
        <CardBody className="p-0">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
              <p className="text-sm text-[var(--text-muted)] font-medium">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <p className="text-[var(--danger)] font-semibold text-base">Error loading orders</p>
              <p className="text-sm text-[var(--text-muted)]">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchUserOrders(userId))} className="py-2 text-xs">Try Again</Button>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 bg-[var(--bg-body)] rounded-full flex items-center justify-center text-[var(--border-light)] transform -rotate-12">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[var(--text-main)]">No orders yet</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start shopping to see them here!</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/')} className="rounded-lg text-xs py-2 mt-2 shadow-sm">Start Shopping</Button>
            </div>
          ) : (
            <OrderList orders={userOrders} role="user" />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Myorder;