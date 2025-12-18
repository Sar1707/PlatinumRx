import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>HabitForge - Build Better Habits</title>
        <meta name="description" content="Track your daily habits, build streaks, and achieve your goals with HabitForge - the simple habit tracker." />
      </Helmet>
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </>
  );
};

export default Index;