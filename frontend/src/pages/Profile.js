// Profile.jsx - 🔥 Real Backend Integrated & Professional (Compact Version)
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Context from '../context';
import SummaryApi from '../common'; // Make sure SummaryApi path is correct

const Profile = () => {
  const navigate = useNavigate();
  const { user, fetchUserDetails } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [uploadingPic, setUploadingPic] = useState(false);

  // Profile Pic State
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);

  // Real User Stats & Orders State
  const [userStats, setUserStats] = useState({
    orders: 0,
    wallet: 0,
    wishlist: 0,
    recentOrders: []
  });

  // Sync profile pic when user context updates
  useEffect(() => {
    if (user?.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user]);

  // 🔥 FETCH REAL USER DATA & STATS FROM BACKEND
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        if (fetchUserDetails) {
          await fetchUserDetails();
        }

        setUserStats({
          orders: user?.orders?.length || 0,
          wallet: user?.walletBalance || 0,
          wishlist: user?.wishlist?.length || 0,
          recentOrders: user?.recentOrders || []
        });

      } catch (error) {
        console.log('Profile load error:', error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [fetchUserDetails, user]);

  // 🔥 FILE TO BASE64 CONVERTER
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // 🔥 UPLOAD & SAVE PROFILE PIC TO BACKEND
  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      setUploadingPic(true);
      const base64Image = await fileToBase64(file);

      const response = await fetch(SummaryApi.updateUserProfile?.url || '/api/update-user', {
        method: SummaryApi.updateUserProfile?.method || 'POST',
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ profilePic: base64Image })
      });

      const data = await response.json();

      if (data.success) {
        setProfilePic(base64Image);
        toast.success("Profile picture updated successfully!");
        if (fetchUserDetails) {
          fetchUserDetails();
        }
      } else {
        toast.error(data.message || "Failed to save profile picture");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploadingPic(false);
    }
  };

  // 🔥 REMOVE / DELETE PROFILE PIC FROM BACKEND
  const handleRemovePic = async () => {
    try {
      const response = await fetch(SummaryApi.updateUserProfile?.url || '/api/update-user', {
        method: SummaryApi.updateUserProfile?.method || 'POST',
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ profilePic: "" })
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setProfilePic(null);
        toast.success("Profile picture removed");
        if (fetchUserDetails) {
          fetchUserDetails();
        }
      } else {
        toast.error("Failed to remove profile picture");
      }
    } catch (err) {
      toast.error("Error removing picture");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 text-xs">
        <div className="text-center space-y-3 animate-pulse">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto shadow-md">
            <span className="text-xl">👤</span>
          </div>
          <p className="text-sm font-semibold text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-3 text-xs sm:text-sm">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* 👤 PROFILE HEADER */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-lg border border-white/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              {/* AVATAR SECTION */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="profile"
                    className="w-full h-full rounded-2xl object-cover shadow-md ring-2 ring-white/50"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md text-2xl font-black text-white ring-2 ring-white/50">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}

                {/* UPLOAD LABEL */}
                <label className={`absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-full cursor-pointer transition ${uploadingPic ? 'opacity-50 pointer-events-none' : 'hover:bg-black'}`}>
                  {uploadingPic ? 'Saving...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPic}
                    className="hidden"
                    disabled={uploadingPic}
                  />
                </label>

                {/* DELETE BUTTON */}
                {profilePic && (
                  <button
                    onClick={handleRemovePic}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg text-[9px] shadow-sm transition"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* USER INFO */}
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  {user?.name || 'Welcome Back!'}
                </h1>
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate mb-1">
                  {user?.email || 'user@example.com'}
                </p>
                <span className="inline-block px-2.5 py-0.5 bg-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-full">
                  Role: {user?.role || 'GENERAL'}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-xs shadow-md hover:opacity-95 transition"
              >
                ✏️ Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold text-xs shadow-sm hover:bg-gray-50 transition"
              >
                🚪 Logout
              </button>
            </div>

          </div>
        </div>

        {/* 📊 STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm text-base">
              🛒
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{userStats.orders}</p>
              <p className="text-[11px] font-medium text-gray-500">Total Orders</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm text-base">
              💰
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">₹{userStats.wallet.toLocaleString()}</p>
              <p className="text-[11px] font-medium text-gray-500">Wallet Balance</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-sm text-base">
              ❤️
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{userStats.wishlist}</p>
              <p className="text-[11px] font-medium text-gray-500">Wishlist Items</p>
            </div>
          </div>
        </div>

        {/* 📦 RECENT ORDERS SECTION */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-5 shadow-sm border border-white/50">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Your Recent Orders
          </h2>
          {userStats.recentOrders.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {userStats.recentOrders.map((order, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-gray-900 truncate max-w-[120px]">{order.title}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[9px] ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>{order.date}</span>
                    <span className="font-bold text-green-600">₹{order.amount?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-xs font-medium">
              No recent orders found. Start shopping now! 🛍️
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4">
          {[
            { icon: '📍', title: 'Addresses', desc: 'Manage locations', path: '/profile/addresses' },
            { icon: '❤️', title: 'Wishlist', desc: `${userStats.wishlist} items`, path: '/wishlist' },
            { icon: '🔒', title: 'Security', desc: 'Change password', path: '/profile/security' },
            { icon: '👥', title: 'Referrals', desc: 'Earn cash', path: '/referral' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => item.path && navigate(item.path)}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-sm border border-white/55 hover:shadow-md transition cursor-pointer text-center group"
            >
              <div className="w-10 h-10 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl mx-auto mb-2 flex items-center justify-center text-base transition">
                <span>{item.icon}</span>
              </div>
              <h3 className="font-semibold text-xs text-gray-900 mb-0.5">{item.title}</h3>
              <p className="text-[10px] text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;