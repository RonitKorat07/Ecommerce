import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderList from '../../components/OrderList';
import { fetchUserOrders } from '../../redux/Orderslice'; // In Myorder.jsx


const Myorder = () => {

  const dispatch = useDispatch();

  const { userOrders, loading, error } = useSelector(state => state.order);
  const user = useSelector((state) => state.user.user);
  
  const userId = user._id; // get from auth or context
  useEffect(() => {
    dispatch(fetchUserOrders(userId));
  }, [dispatch, userId]);

  return (
    <div>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <OrderList orders={userOrders} role="user" />
    </div>
  );
};




export default Myorder
