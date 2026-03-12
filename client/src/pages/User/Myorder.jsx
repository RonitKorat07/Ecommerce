import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderList from '../../components/OrderList';
import { fetchUserOrders } from '../../redux/Orderslice';
import { ClipboardList, ShoppingBag } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/UI/Card';
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
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] flex items-center gap-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <ClipboardList size={32} className="text-[var(--primary)]" />
          My <span className="text-[var(--primary)]">Orders</span>
        </h1>
        <p className="text-[var(--text-muted)] font-medium">Track your recent purchases and order history.</p>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-white">
        <CardBody className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
              <p className="text-[var(--text-muted)] font-medium">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <p className="text-[var(--danger)] font-bold text-xl">Error loading orders</p>
              <p className="text-[var(--text-muted)]">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchUserOrders(userId))}>Try Again</Button>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-20 h-20 bg-[var(--bg-body)] rounded-full flex items-center justify-center text-[var(--border-light)] transform -rotate-12">
                <ShoppingBag size={40} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text-main)]">No orders yet</h3>
                <p className="text-[var(--text-muted)] max-w-xs">Looks like you haven't placed any orders yet. Start shopping to see them here!</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/')} className="rounded-2xl shadow-lg">Start Shopping</Button>
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

