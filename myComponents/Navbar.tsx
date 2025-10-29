"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to get a specific cookie value


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include", // Ensure cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json(); // Parse the JSON response
          if (data._id) {
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
      });

      if (response.ok) {
        // Clear the token cookie
        document.cookie = "token=; Max-Age=0; path=/;"; // Invalidate the cookie
         // Update state
         setIsLoggedIn(false);
      
        router.push("/"); // Redirect to home
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="rounded-full bg-white">
      <div className="grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <h1 className="text-2xl font-bold font-outfitRegular pl-1">LOGO</h1>
        </div>
        <div className="flex justify-center gap-5">
          <Link
            href="/"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/assessment"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            Assessment
          </Link>
          <div className="relative group flex justify-center">
            <Link
              href="/"
              className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black cursor-pointer"
            >
              About
            </Link>
            <div className="absolute hidden group-hover:block mt-10 bg-white border rounded-lg shadow-lg w-56 z-50">
              <ul className="py-2 px-2">
                <li>
                  <Link
                    href="/articles"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 font-outfitRegular hover:rounded-lg"
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/journel"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 font-outfitRegular hover:rounded-lg"
                  >
                    Journel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chatbot"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 font-outfitRegular hover:rounded-lg"
                  >
                    Chatbot
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 font-outfitRegular hover:rounded-lg"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link
            href="/Input1"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex justify-end">
          {!isLoggedIn ? (
            <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
              <Button
                className="rounded-full bg-gray-100 shadow-none text-gray-700 hover:text-black hover:bg-gray-200 font-outfitRegular"
                onClick={() => router.push("/auth/login")}
              >
                Login
              </Button>
              <Button
                className="rounded-full bg-white text-black hover:text-white hover:bg-slate-700 font-outfitRegular"
                onClick={() => router.push("/auth/register")}
              >
                Signup
              </Button>
            </div>
          ) : (
            <Button
              className="rounded-full bg-white text-black hover:text-white hover:bg-slate-700 font-outfitRegular"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
