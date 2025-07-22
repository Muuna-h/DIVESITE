import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display as "Sep 28, 2023"
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Get category color based on category slug
export function getCategoryColor(category: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    it: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
    software: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
    hardware: { bg: "bg-gray-100 dark:bg-gray-800/50", text: "text-gray-700 dark:text-gray-300" },
    emerging: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300" },
    green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
    media: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-300" },
    communication: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
    jobs: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300" },
    reviews: { bg: "bg-slate-100 dark:bg-slate-800/50", text: "text-slate-700 dark:text-slate-300" },
    default: { bg: "bg-primary/10 dark:bg-primary/20", text: "text-primary dark:text-accent" },
  };

  return colors[category] || colors.default;
}

// Get category icon based on category slug
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    it: "fa-server",
    software: "fa-code",
    hardware: "fa-microchip",
    emerging: "fa-atom",
    green: "fa-leaf",
    media: "fa-gamepad",
    communication: "fa-satellite-dish",
    jobs: "fa-briefcase",
    reviews: "fa-star",
  };

  return icons[category] || "fa-server";
}

// Get category name based on category slug
export function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    it: "Information Technology",
    software: "Software Development",
    hardware: "Hardware Technology",
    emerging: "Emerging Technologies",
    green: "Green Tech",
    media: "Media & Entertainment",
    communication: "Communication Technology",
    jobs: "Tech Jobs & Internships",
    reviews: "Tech Product Reviews",
  };

  return names[category] || "Unknown Category";
}

// Get category description based on category slug
export function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    it: "Networking, Cloud Computing, Cybersecurity, Data Storage",
    software: "Programming Languages, Web/App Dev, AI/ML, Mobile Dev",
    hardware: "Computers, Semiconductors, IoT Devices, Robotics",
    emerging: "Quantum Computing, Blockchain, AR/VR, Biotech",
    green: "Renewable Energy, Sustainable Manufacturing, EVs",
    media: "Gaming, Film/Audio Tech, Streaming Services",
    communication: "Telecom, Mobile Tech, Video Conferencing",
    jobs: "Career advice, job listings, and interview preparation",
    reviews: "Hands-on reviews, comparisons, and buying guides",
  };

  return descriptions[category] || "";
}

// Generate a gradient based on category slug
export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    it: "bg-gradient-to-r from-blue-500 to-blue-700",
    software: "bg-gradient-to-r from-purple-500 to-indigo-600",
    hardware: "bg-gradient-to-r from-gray-600 to-gray-800",
    emerging: "bg-gradient-to-r from-cyan-500 to-teal-500",
    green: "bg-gradient-to-r from-green-500 to-emerald-600",
    media: "bg-gradient-to-r from-red-500 to-pink-600",
    communication: "bg-gradient-to-r from-amber-500 to-orange-600",
    jobs: "bg-gradient-to-r from-blue-400 to-violet-500",
    reviews: "bg-gradient-to-r from-slate-500 to-slate-700",
  };

  return gradients[category] || "bg-gradient-to-r from-primary to-primary-dark";
}

// Safe parse function
export function safeParse<T>(json: string | null): T | null {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
// (your existing code in utils.ts)

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}