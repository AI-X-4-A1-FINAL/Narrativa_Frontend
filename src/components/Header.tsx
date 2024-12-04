import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../Contexts/NotificationContext";
import axios from "axios";

interface Notice {
 id: number;
 title: string;
 content: string;
 createdBy: string;
 createdAt: string;
 updatedAt: string;
}

const Header: React.FC = () => {
 const location = useLocation();
 const { isNotificationsOn } = useNotification();
 const navigate = useNavigate();
 const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const menuRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
       setIsMenuOpen(false);
     }
   };

   document.addEventListener("mousedown", handleClickOutside);

   return () => {
     document.removeEventListener("mousedown", handleClickOutside);
   };
 }, []);

 useEffect(() => {
   const fetchLatestNotice = async () => {
     try {
       setIsLoading(true);
       const response = await axios.get(`${process.env.REACT_APP_SPRING_URI}/api/notices`);
       const notices = response.data;
       if (notices && notices.length > 0) {
         setLatestNotice(notices[0]);
       }
     } catch (error) {
       console.error('Failed to fetch notices:', error);
     } finally {
       setIsLoading(false);
     }
   };

   if (location.pathname === "/home") {
     fetchLatestNotice();
   }
 }, [location.pathname]);

 const handleNotificationClick = () => {
   navigate("/notification-list");
 };

 const toggleMenu = () => {
   setIsMenuOpen((prev) => !prev);
 };

 const handleMenuItemClick = () => {
   setIsMenuOpen(false);
 };

 if (location.pathname === "/") {
   return null;
 }

 return (
   <header className="flex flex-col items-center w-full max-w-lg mx-auto p-4 bg-white dark:bg-custom-background text-black fixed top-0 z-10 dark:text-white">
     <div className="flex justify-between items-center w-full">
       <Link to="/home">
         <img
           src="/images/Group 18317.png"
           alt="Bookmarks"
           className="h-14 dark:invert"
         />
       </Link>

       <div className="relative" ref={menuRef}>
         <button
           onClick={toggleMenu}
           className="self-end focus:outline-none"
           aria-haspopup="true"
           aria-expanded={isMenuOpen}
         >
           <img
             src="/images/nav.png"
             alt="Profile"
             className="w-8 mt-4 dark:invert"
           />
         </button>

         {isMenuOpen && (
           <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-custom-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition ease-out duration-200">
             <ul className="flex flex-col p-2">
               <li>
                 <Link
                   to="/profile"
                   className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                   onClick={handleMenuItemClick}
                 >
                   Profile
                 </Link>
               </li>
               <li>
                 <Link
                   to="/bookmarks"
                   className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                   onClick={handleMenuItemClick}
                 >
                   History
                 </Link>
               </li>
             </ul>
           </div>
         )}
       </div>
     </div>

     {isNotificationsOn && location.pathname === "/home" && (
       <div
         className="mt-2 bg-custom-violet dark:bg-gray-800 text-center p-2 rounded-lg cursor-pointer w-full 
         hover:bg-custom-purple dark:hover:bg-indigo-900 dark:shadow-gray-950"
         onClick={handleNotificationClick}
       >
         {isLoading ? (
           <p className="text-white dark:text-gray-300 text-sm tracking-widest">
             공지사항 로딩중...
           </p>
         ) : latestNotice ? (
           <p className="text-white dark:text-gray-300 text-sm tracking-widest">
             📣 공지사항 : {latestNotice.title} 📣
           </p>
         ) : (
           <p className="text-white dark:text-gray-300 text-sm tracking-widest">
             📣 등록된 공지사항이 없습니다 📣
           </p>
         )}
       </div>
     )}
   </header>
 );
};

export default Header;