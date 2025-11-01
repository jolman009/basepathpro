import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Play, PenTool, User, BarChart3, Home, Film, LineChart, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useParams } from "react-router-dom";

/* -------------------- Top Navigation -------------------- */
function TopNav() {
  const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/athletes", label: "Athletes", icon: User },
    { to: "/videos", label: "Videos", icon: Film },
    { to: "/analytics", label: "Analytics", icon: LineChart },
  ];
  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 bg-white/50 dark:bg-gray-900/50 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600" />
          <span className="font-extrabold text-xl tracking-tight text-blue-700 dark:text-blue-400">SwingIQ</span>
        </motion.div>

        {/* Tabs */}
        <div className="hidden md:flex items-center gap-1 ml-6">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => [
                "group inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition",
                isActive
                  ? "bg-blue-600/10 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-white/5 hover:text-blue-700 dark:hover:text-blue-300",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span className="ml-2 h-1 w-0 group-hover:w-6 bg-blue-600 rounded transition-all" />
            </NavLink>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search & Actions */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input className="pl-9 pr-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-sm outline-none focus:ring-2 ring-blue-500" placeholder="Search athletes, videos…" />
          </div>
          <Button variant="ghost" className="rounded-xl"><Bell className="h-5 w-5" /></Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Coach Login</Button>
        </div>
      </div>
    </nav>
  );
}
