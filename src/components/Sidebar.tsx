import Link from "next/link";
import { 
  MessageSquarePlus, 
  Image as ImageIcon, 
  Library, 
  Briefcase, 
  CalendarClock, 
  Pin,
  Settings,
  User
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-[260px] h-full flex-shrink-0 bg-[#171717] flex flex-col transition-all duration-300 hidden md:flex">
      <div className="p-3">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
            <span className="font-bold text-sm">AI</span>
          </div>
          <span className="font-medium text-sm text-gray-200">BTC Research</span>
        </Link>
      </div>

      <div className="px-3 pb-2">
        <button className="flex items-center gap-2 px-3 py-2.5 w-full bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-sm font-medium text-gray-200">
          <MessageSquarePlus className="w-4 h-4" />
          Obrolan baru
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-none">
        <div className="space-y-1">
          <NavItem icon={<ImageIcon className="w-4 h-4" />} label="Gambar" />
          <NavItem icon={<Library className="w-4 h-4" />} label="Pustaka" />
          <NavItem icon={<Briefcase className="w-4 h-4" />} label="Proyek" />
          <NavItem icon={<CalendarClock className="w-4 h-4" />} label="Terjadwal" />
        </div>

        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
            <Pin className="w-3 h-3" />
            Disematkan
          </div>
          <NavItem label="Strategi Konten Finansial" />
          <NavItem label="Riset Kripto Harian" />
          <NavItem label="Jadwal Laporan Saham Indo" />
        </div>
      </div>

      <div className="p-3 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Satriaji</p>
            <p className="text-xs text-gray-500 truncate">Pro Plan</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors text-sm text-gray-300 hover:text-gray-100 group"
    >
      {icon && <span className="text-gray-400 group-hover:text-gray-300">{icon}</span>}
      <span className="truncate">{label}</span>
    </a>
  );
}
