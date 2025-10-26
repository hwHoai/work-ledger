'use client';

import { useAppSelector } from '~/store/hooks';
import Header from '~/components/ui/Header';
import HomePage from '~/screen/home/HomePage';
import AttendancePage from '~/screen/attendance/AttendancePage';
import TrendPage from '~/screen/trend/TrendPage';
import ServicesPage from '~/screen/service/ServicesPage';
import DashboardPage from '~/screen/dashboard/DashboardPage';

export default function Home() {
  const activeIndex = useAppSelector((state) => state.navigation.activeIndex);

  return (
    <main className="min-h-screen bg-gradient-hero pt-20">
      <Header />
      <div className="animate-fadeIn">
        {activeIndex === 0 && <HomePage />}
        {activeIndex === 1 && <AttendancePage />}
        {activeIndex === 2 && <TrendPage />}
        {activeIndex === 3 && <ServicesPage />}
        {activeIndex === 4 && <DashboardPage />}
      </div>
    </main>
  );
}
