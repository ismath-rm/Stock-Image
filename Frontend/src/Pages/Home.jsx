// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../Redux/authSlice';
// import { useNavigate } from 'react-router-dom';
// import ImageUpload from '../Pages/ImageUpload';
// import ImageGallery from '../Pages/ImageGallery';
// import { LogOut, Upload, Image } from 'lucide-react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faSignOutAlt,} from "@fortawesome/free-solid-svg-icons";

// const Home = () => {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/');
//   };

//   console.log("Current user state:", user); // Debugging log

//   return (
//     <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: '#221d30' }}>
//       {/* <header className="bg-transparent text-white py-6 px-8 shadow-lg">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <h1 className="text-3xl font-bold">Image Gallery</h1>
//           <div className="flex items-center ">
//             <span className="mr-4">Welcome, {user?.username || 'Guest'}!</span> 
//             <button
//               onClick={handleLogout}
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out"
//             >
//               <LogOut className="mr-2 h-5 w-5" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header> */}

//       <header className="bg-transparent text-white py-4 px-6 flex items-center justify-between">
//         <div className="flex-1 flex justify-center">
//           <h1 className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-transparent bg-clip-text text-2xl md:text-3xl font-bold rounded-lg">Stock Image</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handleLogout}
//             className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-lg text-white p-2 rounded-full"
//             aria-label="Logout"
//           >
//             <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
//           </button>
//         </div>
//       </header>

//       <div className="bg-[#38304f] flex flex-col items-center justify-center w-full max-w-5xl text-gray-700 p-4 md:p-10 rounded-lg mx-auto">
//         <main>
//           <div className="mb-8">
//             <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-gray-300 justify-start">
//               <Upload className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-300" />
//               Upload Images
//             </h2>
//             <div className="bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-12 w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
//               <ImageUpload />
//               <p className="text-gray-600">Feature to upload images will go here.</p>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-gray-300 justify-start">
//               <Image className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-300" />
//               Image Gallery
//             </h2>
//             <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
//               <div className="p-6 md:p-8 lg:p-12 overflow-y-auto">
//                 <ImageGallery />
//                 <p className="text-gray-600">Your image gallery will be displayed here.</p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../Pages/ImageUpload';
import ImageGallery from '../Pages/ImageGallery';
import { LogOut, Upload, Image } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSignOutAlt,} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  console.log("Current user state:", user); // Debugging log

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: '#221d30' }}>
      

      <header className="bg-transparent text-white py-4 px-6 flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <h1 className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-transparent bg-clip-text text-2xl md:text-3xl font-bold rounded-lg">Stock Image</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-lg text-white p-2 rounded-full hover:bg-gradient-to-l focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="bg-[#38304f] flex flex-col items-center justify-center w-full max-w-5xl text-gray-700 p-4 md:p-10 rounded-lg mx-auto">
        <main>
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-gray-300 justify-start">
              <Upload className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-300" />
              Upload Images
            </h2>
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-12 w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
              <ImageUpload />
              <p className="text-gray-600">Feature to upload images will go here.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-gray-300 justify-start">
              <Image className="mr-2 h-5 md:h-6 w-5 md:w-6 text-gray-300" />
              Image Gallery
            </h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
              <div className="p-6 md:p-8 lg:p-12 overflow-y-auto">
                <ImageGallery />
                <p className="text-gray-600">Your image gallery will be displayed here.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;