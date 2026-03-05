"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
LayoutDashboard,
FileText,
Folder,
Users,
Megaphone,
DollarSign,
BarChart3,
Settings,
LogOut,
Bell,
Search,
ChevronDown,
Menu,
MessageCircle,
X
} from "lucide-react";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AdminLayout({
children,
}: {
children: React.ReactNode;
}) {

const pathname = usePathname();
const { data: session } = useSession();
const userName = session?.user?.name || "Admin";

const [collapsed, setCollapsed] = useState(false);
const [openAds, setOpenAds] = useState(true);
const [profileOpen, setProfileOpen] = useState(false);
const [chatOpen, setChatOpen] = useState(false);

const navItems = [
{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
{ name: "News-Control", href: "/admin/posts", icon: FileText },
{ name: "Categories", href: "/admin/categories", icon: Folder },
{ name: "Users", href: "/admin/user", icon: Users },
{ name: "Newsletter", href: "/admin/newsletter", icon: Bell },
{ name: "Revenue", href: "/admin/revenue", icon: DollarSign },
{ name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
{ name: "Settings", href: "/admin/settings", icon: Settings },
];

return (

<div className="flex min-h-screen text-white bg-gradient-to-br from-[#0c0f17] via-[#111827] to-[#1a2238]">

{/* SIDEBAR */}

<aside
className={`${collapsed ? "w-20" : "w-72"} transition-all duration-300 bg-black/50 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col justify-between`}
>

<div>

{/* LOGO */}

<div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
{!collapsed && (
<h2 className="text-xl font-bold tracking-wide">
NationPath
</h2>
)}
<button onClick={() => setCollapsed(!collapsed)}>
<Menu size={20} />
</button>
</div>

{/* USER */}
{!collapsed && (

<div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
<div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff4d4d] to-[#ffb347] flex items-center justify-center font-bold text-black">
{userName.charAt(0)}
</div>
<div>
<p className="text-xs text-gray-400">Welcome</p>
<p className="font-semibold text-lg">{userName}</p>
</div>
</div>
)}

<nav className="p-4 space-y-2">

{navItems.map((item) => {

const Icon = item.icon;

let isActive = false;

if (item.href === "/admin") {
isActive = pathname === "/admin";
} else {
isActive = pathname.startsWith(item.href);
}

return (

<Link
key={item.name}
href={item.href}
className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
isActive
? "bg-gradient-to-r from-[#ff4d4d] via-[#ff6a3d] to-[#ffb347] text-white font-semibold shadow-lg"
: "text-gray-300 hover:bg-white/10 hover:text-white"
}`}
>

{isActive && ( <span className="absolute left-0 top-0 h-full w-1 bg-[#ff4d4d] rounded-l-xl"></span>
)}

<Icon size={18} />
{!collapsed && item.name}

</Link>

);

})}

{/* ADS DROPDOWN */}

<div>

<button
onClick={() => setOpenAds(!openAds)}
className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10 transition"

>

<span className="flex items-center gap-3 text-gray-300">
<Megaphone size={18} />
{!collapsed && "Advertisements"}
</span>

{!collapsed && (
<ChevronDown
size={16}
className={`transition-transform ${openAds ? "rotate-180" : ""}`}
/>
)}

</button>

{!collapsed && openAds && (

<div className="ml-8 mt-2 space-y-2 text-sm">

<SubItem href="/admin/ads" label="All Ads" pathname={pathname} />

<SubItem href="/admin/ads/create" label="Create Ad" pathname={pathname} />

<SubItem href="/admin/ads/placements" label="Ad Placements" pathname={pathname} />

<SubItem href="/admin/ads/performance" label="Campaign Performance" pathname={pathname} />

</div>

)}

</div>

</nav>
</div>

{/* LOGOUT */}

<div className="p-4 border-t border-white/10">

<button
onClick={() => signOut()}
className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/40 transition text-red-300 hover:text-white"

>

<LogOut size={18} />
{!collapsed && "Logout"}

</button>

</div>

</aside>

{/* MAIN AREA */}

<div className="flex-1 flex flex-col">

{/* TOP NAVBAR */}

<header className="h-20 px-8 flex items-center justify-between bg-black/30 backdrop-blur-xl border-b border-white/10">

<div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl w-96">

<Search size={16} className="text-gray-400" />

<input
placeholder="Search articles, users, ads..."
className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
/>

</div>

<div className="flex items-center gap-6 relative">

<Bell className="cursor-pointer text-gray-300 hover:text-white" />

<div
onClick={() => setProfileOpen(!profileOpen)}
className="flex items-center gap-2 cursor-pointer"
>

<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff4d4d] to-[#ffb347] flex items-center justify-center text-black font-bold">
{userName.charAt(0)}
</div>

<ChevronDown size={16} />

</div>

{profileOpen && (

<div className="absolute right-0 top-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-48 shadow-2xl">

<p className="text-sm mb-3">{userName}</p>

<button
onClick={() => signOut()}
className="text-red-400 hover:text-white text-sm"

>

Logout </button>

</div>

)}

</div>

</header>

{/* PAGE CONTENT */}

<main className="flex-1 p-10">{children}</main>

</div>

{/* FLOATING CHAT BUTTON */}

<button
onClick={() => setChatOpen(true)}
className="fixed bottom-6 right-6 bg-gradient-to-r from-[#ff4d4d] to-[#ffb347] p-4 rounded-full shadow-2xl hover:scale-105 transition"

>

<MessageCircle size={24} />

</button>

{/* CHAT POPUP */}

{chatOpen && (

<div className="fixed bottom-24 right-6 w-80 bg-[#111827] border border-white/10 rounded-xl shadow-2xl">

<div className="flex justify-between items-center px-4 py-3 border-b border-white/10">

<span className="font-semibold">Team Chat</span>

<X
size={18}
className="cursor-pointer"
onClick={() => setChatOpen(false)}
/>

</div>

<div className="p-4 h-60 overflow-y-auto text-sm text-gray-300">

<p>Reporter: Article ready</p>
<p>Editor: Send headline</p>
<p>Admin: Publish tonight</p>

</div>

<div className="flex border-t border-white/10">

<input
placeholder="Type message..."
className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
/>

<button className="px-4 text-red-400">Send</button>

</div>

</div>

)}

</div>
);
}

function SubItem({ href, label, pathname }: any) {

const isActive = pathname === href;

return (

<Link
href={href}
className={`block px-4 py-2 rounded-lg transition ${
isActive
? "bg-gradient-to-r from-[#ff4d4d] via-[#ff6a3d] to-[#ffb347] text-white font-semibold"
: "text-gray-300 hover:bg-white/10 hover:text-white"
}`}
>
{label}
</Link>

);

}
