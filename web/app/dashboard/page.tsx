import { Suspense } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RecentAdded from "@/components/RecentAdded";
import DashBoardSections from "@/components/DashBoardSections";

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col">
        <Hero />
        <RecentAdded />
        <Suspense fallback={null}>
          <DashBoardSections />
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
