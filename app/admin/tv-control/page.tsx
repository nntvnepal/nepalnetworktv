import Link from "next/link"
import {
  Zap,
  Tv,
  FileText,
  BarChart3,
  Activity,
  Trophy
} from "lucide-react"

type CardProps = {
  title: string
  desc: string
  icon: React.ReactNode
  link: string
}

export default function TVControlDashboard() {

  return (

    <div className="text-white">

      <h1 className="text-3xl font-bold mb-2">
        TV Control / Newsroom Tools
      </h1>

      <p className="text-gray-400 mb-8 max-w-2xl">
        Manage broadcast graphics, ticker, teleprompter and
        live newsroom data for NNTV studio production control.
      </p>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">

        <Card
          title="Ticker Manager"
          desc="Control ticker for TV and website"
          icon={<Zap size={22} />}
          link="/admin/tv-control/breaking-news"
        />

        <Card
          title="Lower Third"
          desc="On-screen headline graphics"
          icon={<Activity size={22} />}
          link="/admin/tv-control/lower-third"
        />

        <Card
          title="Election Dashboard NNTV"
          desc="Election seat and result board"
          icon={<Trophy size={22} />}
          link="/admin/elections"
        />

        <Card
          title="Live Score"
          desc="Sports scoreboard graphics"
          icon={<BarChart3 size={22} />}
          link="/admin/tv-control/live-score"
        />

        <Card
          title="Teleprompter Script"
          desc="Anchor script for studio"
          icon={<FileText size={22} />}
          link="/admin/tv-control/script"
        />

        <Card
          title="Live TV Control"
          desc="Manage broadcast stream"
          icon={<Tv size={22} />}
          link="/admin/tv-control/live-tv"
        />

      </div>

    </div>

  )

}

function Card({ title, desc, icon, link }: CardProps) {

  return (

    <Link href={link}>

      <div className="group bg-[#3b0146] hover:bg-[#4c0259] border border-[#5a1167] hover:border-[#8c2fa6] transition-all duration-200 rounded-xl p-6 shadow-lg cursor-pointer">

        <div className="flex items-center gap-3 mb-3">

          <div className="bg-black/30 p-2 rounded-lg group-hover:scale-110 transition">
            {icon}
          </div>

          <h3 className="text-lg font-semibold">
            {title}
          </h3>

        </div>

        <p className="text-sm text-gray-300 leading-relaxed">
          {desc}
        </p>

      </div>

    </Link>

  )

}