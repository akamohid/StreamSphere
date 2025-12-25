import {
  History,
  ListVideo,
  Video,
  BarChart3,
  Upload,
} from "lucide-react";

const icons = {
  History,
  ListVideo,
  Video,
  BarChart3,
  Upload,
};

export default function SidebarItem({ label, icon, onClick }) {
  const Icon = icons[icon];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-2 rounded-md bg-blue-900 hover:bg-blue-800/50 transition-all duration-200 group"
    >
      <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
      <span className="text-left group-hover:text-white text-blue-200">{label}</span>
    </button>
  );
}

