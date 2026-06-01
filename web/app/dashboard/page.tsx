'use client'

import DashboardSections from "@/components/DashboardSections"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import RecentAdded from "@/components/RecentAdded"

const Dashboard = () => {
  return (
    <>
      <Hero />
      <RecentAdded />
      <DashboardSections />
      <Footer />
    </>
  )
}

export default Dashboard