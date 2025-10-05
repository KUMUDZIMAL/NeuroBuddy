"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/myComponents/Navbar";
import Bargraph from "@/myComponents/Bargraph";
import Piechart from "@/myComponents/Piechart";
import Areachart1 from "@/myComponents/Areachart";
import FinalScore from "@/myComponents/FinalScore";
import MoodCounter from "@/myComponents/Moodcounter";
import EverydayInputCard from "@/myComponents/HorizontalScrollInputCard";

export default function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMoodData, setHasMoodData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth
        const resUser = await fetch("/api/auth/user", { credentials: "include" });
        if (!resUser.ok || resUser.status === 401) { router.push("/auth/login"); return; }
        const dataUser = await resUser.json();
        setUsername(dataUser.username);

        // Check mood data
        const resMood = await fetch("/api/auth/mood", { credentials: "include" });
        if (resMood.ok) {
          const dataMood = await resMood.json();
          if (!dataMood.analysis || dataMood.analysis.length === 0) setHasMoodData(false);
        }
      } catch (err) {
        console.error(err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-100"><div className="w-24 h-24 border-8 border-purple-700 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="h-screen px-8 gap-4 flex flex-col relative">
      <Navbar />
      <div className={`grid grid-cols-12 bg-slate-100 rounded-3xl gap-4 p-4 flex-1 ${!hasMoodData ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
        {/* Left */}
        <div className="bg-white rounded-3xl p-4 flex flex-col col-span-5 shadow-md">
          <h1 className="text-2xl font-bold">Good Morning, <span className="text-violet-700">{username}</span></h1>
          <p>Here’s a quick summary of your stats:</p>
          <Bargraph />
          <MoodCounter />
        </div>
        {/* Right */}
        <div className="col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 bg-white rounded-3xl p-4 flex justify-center shadow-md"><Piechart /></div>
            <div className="col-span-8 bg-white rounded-3xl p-4 flex justify-center shadow-md"><Areachart1 /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition"><EverydayInputCard /></div>
            <div className="col-span-1 bg-white rounded-3xl p-4 flex justify-center shadow-md"><FinalScore /></div>
          </div>
        </div>
      </div>

      {!hasMoodData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">Dashboard is Empty 🙁! Track your mood to see stats</h2>
            <Link href="/Input1"><button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700">Mood Track</button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
