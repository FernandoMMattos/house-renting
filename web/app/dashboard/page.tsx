import { Suspense } from "react";
import DashBoardSections from "@/components/DashBoardSections";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import RecentAdded from "@/components/RecentAdded";

const Dashboard = () => {
  return (
    <>
      <Hero />
      <RecentAdded />
      <Suspense fallback={null}>
        <DashBoardSections />
      </Suspense>
      <Footer />
    </>
  );
};

export default Dashboard;
