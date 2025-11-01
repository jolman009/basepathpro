import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Play, PenTool, User, BarChart3, Home, Film, LineChart, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useParams } from "react-router-dom";

/* -------------------- Mobile Bottom Nav -------------------- */
function MobileNav() {
    const items = [
      { to: "/", label: "Home", icon: Home },
      { to: "/videos", label: "Videos", icon: Film },
      { to: "/analyze", label: "Analyze", icon: PenTool },
      { to: "/athletes", label: "Athletes", icon: User },
      { to: "/analytics", label: "Stats", icon: BarChart3 },
    ];
    return (
      <div className="md:hidden fixed bottom-4 inset-x-0 z-40 px-4">
        <div className="mx-auto max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-black/5 dark:border-white/10">
          <div className="grid grid-cols-5">
            {items.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) => [
                  "flex flex-col items-center gap-1 py-3 text-xs",
                  isActive
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }
  