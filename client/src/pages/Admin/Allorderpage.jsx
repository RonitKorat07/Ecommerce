    import{ useEffect, useState } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import OrderList from '../../components/OrderList';
    import { fetchAdminOrders } from '../../redux/Orderslice';

    const Allorderpage = () => {
    const dispatch = useDispatch();
    const { adminOrders, adminCurrentPage, adminTotalPages, loading, error } = useSelector(state => state.order);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAdminOrders(page));
    }, [dispatch, page]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < adminTotalPages) setPage(page + 1);
    };

    return (
        <div>
        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <OrderList orders={adminOrders} role="admin" />

        {/* Pagination controls */}
        <div className="flex justify-center space-x-4 mt-4">
            <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Prev
            </button>
            <span>Page {page} of {adminTotalPages}</span>
            <button onClick={handleNext} disabled={page === adminTotalPages} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
            Next
            </button>
        </div>
        </div>
    );
    };

    export default Allorderpage;
