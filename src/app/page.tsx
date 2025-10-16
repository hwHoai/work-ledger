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

  const renderPage = () => {
    switch (activeIndex) {
      case 0:
        return <HomePage />;
      case 1:
        return <AttendancePage />;
      case 2:
        return <TrendPage />;
      case 3:
        return <ServicesPage />;
      case 4:
        return <DashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-hero pt-20">
      <Header />
      <div className="animate-fadeIn">{renderPage()}</div>
    </main>
  );
}
