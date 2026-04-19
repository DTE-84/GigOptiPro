/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface PlatformData {
  id: string;
  name: string;
  icon: string;
  currentEarnings: number;
  ratingTrend: number;
  bestHours: string;
  topLocation: string;
  color: string;
  bgColor: string;
  orders: number;
  status: 'peak' | 'normal' | 'low';
}

export const MOCK_PLATFORMS: PlatformData[] = [
  {
    id: "doordash",
    name: "DoorDash",
    icon: "🍔",
    currentEarnings: 28.50,
    ratingTrend: 12,
    bestHours: "11:30 AM - 1:30 PM",
    topLocation: "Downtown Core",
    color: "#dc2626", // red-600
    bgColor: "bg-red-50 dark:bg-red-950/30",
    orders: 24,
    status: 'peak'
  },
  {
    id: "ubereats",
    name: "Uber Eats",
    icon: "🍕",
    currentEarnings: 24.75,
    ratingTrend: 8,
    bestHours: "6:00 PM - 8:30 PM",
    topLocation: "Midtown Area",
    color: "#1f2937", // slate-800
    bgColor: "bg-slate-50 dark:bg-slate-900/40",
    orders: 18,
    status: 'normal'
  },
  {
    id: "spark",
    name: "Spark Driver",
    icon: "⚡",
    currentEarnings: 22.30,
    ratingTrend: -3,
    bestHours: "9:00 AM - 11:00 AM",
    topLocation: "Residential North",
    color: "#ca8a04", // yellow-600
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    orders: 15,
    status: 'low'
  },
];
