import { Suspense } from "react";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import RecentAdded from "@/components/RecentAdded";
import DashBoardSections from "@/components/DashBoardSections";

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
