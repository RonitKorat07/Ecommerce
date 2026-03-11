import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import Userproductcardverti from '../../components/Userproductcardverti';
import axiosClient from '../../api/axiosClient';
import API from '../../api/endpoints';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    useEffect(() => {
      const fetchproduct  = async () => {
            try {
                const res = await axiosClient.get(API.search(query))
                setProducts(res.data.products)
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
      }
           fetchproduct(); 
        }, [query])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Userproductcardverti key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default SearchPage
