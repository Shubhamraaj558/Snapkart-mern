import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import {
  FaDownload,
  FaArrowLeft,
  FaCheckCircle,
  FaShoppingBag,
} from "react-icons/fa";

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  // Fetch Order Details from Backend
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(
        `${SummaryApi.getOrderDetails.url}?orderId=${orderId}`,
        {
          method: SummaryApi.getOrderDetails.method,
          credentials: "include",
        },
      );
      const data = await response.json();
      if (data.success) {
        setOrderData(data.data);
      } else {
        toast.error(data.message || "Failed to load order details");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  // Download PDF Function
  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const options = {
      margin: 10,
      filename: `Snapkart-Invoice-${orderId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-medium">
        Loading Invoice...
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-medium">
        Order not found!
      </div>
    );
  }

  // Extracting payment details safely based on common backend schemas
  const paymentMethod =
    orderData.paymentDetails?.payment_method_type?.[0] ||
    orderData.paymentMethod ||
    "Online / Prepaid";
  const paymentStatus =
    orderData.paymentDetails?.payment_status ||
    orderData.paymentStatus ||
    "Paid";

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl transition text-sm font-medium"
        >
          <FaArrowLeft /> Back
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition text-sm"
        >
          <FaDownload /> Download PDF
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div
        ref={invoiceRef}
        className="max-w-3xl mx-auto bg-white text-slate-900 p-8 rounded-2xl shadow-2xl font-sans"
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        {/* Professional Header with Snapkart Branding */}
        <div className="flex justify-between items-start border-b-2 border-purple-600 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <FaShoppingBag className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                SNAPKART
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Smart Shopping Platform
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-wide">
              Tax Invoice
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Invoice No:{" "}
              <span className="font-semibold text-slate-700">
                {orderId?.slice(-8).toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-slate-500">
              Date:{" "}
              <span className="font-semibold text-slate-700">
                {new Date(orderData.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* Shipping & Company Info */}
        <div className="grid grid-cols-2 gap-6 mb-8 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
              Sold By:
            </h3>
            <p className="font-bold text-slate-800">Snapkart Retail Pvt Ltd.</p>
            <p className="text-slate-600 text-xs mt-0.5">
              E-Commerce Tech Park, Sector 62
            </p>
            <p className="text-slate-600 text-xs">GSTIN: 07AABCS1234F1Z5</p>
            <p className="text-slate-600 text-xs">
              Support: support@snapkart.com
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
              Shipping Address:
            </h3>
            <p className="font-bold text-slate-800">
              {orderData.shippingAddress?.name || "Customer"}
            </p>
            <p className="text-slate-600 text-xs mt-0.5">
              {orderData.shippingAddress?.address}
            </p>
            <p className="text-slate-600 text-xs">
              {orderData.shippingAddress?.city},{" "}
              {orderData.shippingAddress?.state} -{" "}
              {orderData.shippingAddress?.pincode}
            </p>
            <p className="text-slate-600 text-xs mt-1 font-medium">
              Phone:{" "}
              {orderData.shippingAddress?.mobile ||
                orderData.shippingAddress?.phone}
            </p>
          </div>
        </div>

        {/* Payment & Order Meta Info */}
        <div className="grid grid-cols-2 gap-6 mb-8 text-xs border-b border-slate-200 pb-4">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment Method:
            </span>
            <span className="font-semibold text-slate-800 uppercase bg-slate-100 px-2.5 py-1 rounded-md inline-block">
              {paymentMethod}
            </span>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment Status:
            </span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
              <FaCheckCircle className="text-xs" /> {paymentStatus}
            </span>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
              <th className="py-3 px-4 text-left rounded-l-lg">
                Item Description
              </th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orderData.productDetails?.map((item, index) => (
              <tr key={index}>
                <td className="py-4 px-4 font-medium text-slate-800">
                  {item.name}
                </td>
                <td className="py-4 px-4 text-center text-slate-600 font-semibold">
                  {item.quantity || 1}
                </td>
                <td className="py-4 px-4 text-right text-slate-600">
                  ₹{item.price?.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-bold text-slate-800">
                  ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72 space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium">
                ₹{orderData.totalAmount?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Charges:</span>
              <span className="text-emerald-600 font-bold uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded">
                FREE
              </span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-base border-t border-slate-200 pt-2 mt-2">
              <span>Grand Total:</span>
              <span className="text-purple-600">
                ₹{orderData.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400 space-y-1">
          <p>
            This is a computer-generated tax invoice and does not require a
            physical signature or stamp.
          </p>
          <p className="font-semibold text-slate-600">
            Thank you for shopping with Snapkart! Visit again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
