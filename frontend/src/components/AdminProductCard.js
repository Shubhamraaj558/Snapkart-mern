import React, { useState } from 'react'
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminProductCard = ({
  data,
  fetchdata
}) => {

  const [editProduct, setEditProduct] = useState(false)

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${SummaryApi.deleteProduct.url}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Product deleted successfully");
        fetchdata();
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Server error while deleting");
    }
  };

  return (
    <div className='bg-white p-4 rounded relative'>

      {/* PRODUCT IMAGE */}
      <div className='w-40'>
        <div className='w-32 h-32 flex justify-center items-center'>
          <img src={data?.productImage[0]} className='mx-auto object-fill h-full' />
        </div>

        <h1 className='text-ellipsis line-clamp-2'>
          {data.productName}
        </h1>

        <p className='font-semibold'>
          {displayINRCurrency(data.sellingPrice)}
        </p>

        {/* BUTTONS */}
        <div className='flex items-center justify-end gap-2'>

          {/* EDIT */}
          <div
            className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer'
            onClick={() => setEditProduct(true)}
          >
            <MdModeEditOutline />
          </div>

          {/* DELETE */}
          <div
            className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer'
            onClick={() => {
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this product? This action cannot be undone."
              );

              if (confirmDelete) {
                handleDelete(data._id);
              }
            }}
          >
            <MdDelete />
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      {
        editProduct && (
          <AdminEditProduct
            productData={data}
            onClose={() => setEditProduct(false)}
            fetchdata={fetchdata}
          />
        )
      }

    </div>
  )
}

export default AdminProductCard
