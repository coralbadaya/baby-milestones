import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Baby from './pages/Baby';
import Essentials from './pages/Essentials';
import Premium from './pages/Premium';
import MonthDetail from './pages/MonthDetail';
import Dashboard from './pages/Dashboard';
import Sources from './pages/Sources';
import Shopping from './pages/Shopping';
import Vaccination from './pages/Vaccination';
import Travel from './pages/Travel';
import MomCare from './pages/MomCare';
import Community from './pages/Community';
import Guides from './pages/Guides';
import GuideArticle from './pages/GuideArticle';
import Faq from './pages/Faq';
import StaticPage from './pages/StaticPage';
import AssistantPanel from './components/AssistantPanel';
import { ROUTES, isCommunityTab } from './routes';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MonthDetailRoute({ checkedItems, toggleCheck, getCurrentWeek }) {
  const { month: monthParam } = useParams();
  const navigate = useNavigate();
  const month = Number(monthParam);

  if (!Number.isInteger(month) || month < 1 || month > 36) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <MonthDetail
      month={month}
      checkedItems={checkedItems}
      toggleCheck={toggleCheck}
      onBack={() => navigate(ROUTES.baby)}
      onNavigate={(m) => navigate(ROUTES.month(m))}
      currentWeek={getCurrentWeek()}
    />
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [birthDate, setBirthDate] = useState(() => localStorage.getItem('babyBirthDate') || '');
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('babyMilestoneChecks');
    return saved ? JSON.parse(saved) : {};
  });
  const [vaccineScheduleType, setVaccineScheduleType] = useState(() => localStorage.getItem('babyVaccineScheduleType') || 'india');
  const [vaccineRecords, setVaccineRecords] = useState(() => {
    const saved = localStorage.getItem('babyVaccineRecords');
    return saved ? JSON.parse(saved) : {};
  });
  const [customVaccines, setCustomVaccines] = useState(() => {
    const saved = localStorage.getItem('babyCustomVaccines');
    return saved ? JSON.parse(saved) : [];
  });
  const [vaccineReminderDays, setVaccineReminderDays] = useState(() => {
    const saved = localStorage.getItem('babyVaccineReminderDays');
    return saved ? JSON.parse(saved) : 7;
  });

  useEffect(() => {
    localStorage.setItem('babyMilestoneChecks', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    if (birthDate) {
      localStorage.setItem('babyBirthDate', birthDate);
    }
  }, [birthDate]);

  useEffect(() => {
    localStorage.setItem('babyVaccineScheduleType', vaccineScheduleType);
  }, [vaccineScheduleType]);
  useEffect(() => {
    localStorage.setItem('babyVaccineRecords', JSON.stringify(vaccineRecords));
  }, [vaccineRecords]);
  useEffect(() => {
    localStorage.setItem('babyCustomVaccines', JSON.stringify(customVaccines));
  }, [customVaccines]);
  useEffect(() => {
    localStorage.setItem('babyVaccineReminderDays', JSON.stringify(vaccineReminderDays));
  }, [vaccineReminderDays]);

  const getCurrentMonth = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    const days = now.getDate() - birth.getDate();
    const adjusted = days < 0 ? months - 1 : months;
    return Math.max(1, Math.min(36, adjusted + 1));
  };

  const getCurrentWeek = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    const diffDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    const currentMonth = getCurrentMonth();
    if (!currentMonth) return null;
    const daysIntoMonth = diffDays - ((currentMonth - 1) * 30);
    return Math.max(1, Math.min(4, Math.ceil(daysIntoMonth / 7)));
  };

  const toggleCheck = useCallback((id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSelectMonth = useCallback((month) => {
    navigate(ROUTES.month(month));
  }, [navigate]);

  const showAssistant =
    location.pathname === ROUTES.home
    || location.pathname.startsWith('/month/')
    || location.pathname === ROUTES.baby
    || location.pathname === ROUTES.travel;

  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="app-main">
        <Routes>
        <Route
          path={ROUTES.home}
          element={(
            <Home
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              currentMonth={getCurrentMonth()}
              checkedItems={checkedItems}
              onSelectMonth={handleSelectMonth}
            />
          )}
        />
        <Route
          path={ROUTES.baby}
          element={(
            <Baby
              birthDate={birthDate}
              currentMonth={getCurrentMonth()}
              checkedItems={checkedItems}
              onSelectMonth={handleSelectMonth}
            />
          )}
        />
        <Route
          path={ROUTES.essentials}
          element={<Essentials />}
        />
        <Route path={ROUTES.premium} element={<Premium />} />
        <Route
          element={(
            <MonthDetailRoute
              checkedItems={checkedItems}
              toggleCheck={toggleCheck}
              getCurrentWeek={getCurrentWeek}
            />
          )}
        />
        <Route
          path={ROUTES.shopping}
          element={(
            <Shopping
              checkedItems={checkedItems}
              toggleCheck={toggleCheck}
              currentMonth={getCurrentMonth()}
            />
          )}
        />
        <Route
          path={ROUTES.vaccination}
          element={(
            <Vaccination
              birthDate={birthDate}
              currentMonth={getCurrentMonth()}
              scheduleType={vaccineScheduleType}
              onScheduleTypeChange={setVaccineScheduleType}
              vaccineRecords={vaccineRecords}
              setVaccineRecords={setVaccineRecords}
              customVaccines={customVaccines}
              setCustomVaccines={setCustomVaccines}
              reminderDays={vaccineReminderDays}
              setReminderDays={setVaccineReminderDays}
            />
          )}
        />
        <Route
          path={ROUTES.travel}
          element={<Travel currentMonth={getCurrentMonth()} />}
        />
        <Route
          path={ROUTES.momCare}
          element={(
            <MomCare birthDate={birthDate} />
          )}
        />
        <Route path={ROUTES.community} element={<Navigate to={ROUTES.communityTab('feed')} replace />} />
        <Route
          path="/community/:tab"
          element={(
            <CommunityTabRoute currentMonth={getCurrentMonth()} />
          )}
        />
        <Route
          path={ROUTES.progress}
          element={(
            <Dashboard
              checkedItems={checkedItems}
              onSelectMonth={handleSelectMonth}
            />
          )}
        />
        <Route path={ROUTES.sources} element={<Sources />} />

        <Route path={ROUTES.guides} element={<Guides />} />
        <Route path="/guides/:slug" element={<GuideArticle />} />
        <Route path={ROUTES.faq} element={<Faq />} />

        <Route path={ROUTES.about} element={<StaticPage pageKey="about" />} />
        <Route path={ROUTES.contact} element={<StaticPage pageKey="contact" />} />
        <Route path={ROUTES.editorialPolicy} element={<StaticPage pageKey="editorialPolicy" />} />
        <Route path={ROUTES.reviewers} element={<StaticPage pageKey="reviewers" />} />
        <Route path={ROUTES.privacy} element={<StaticPage pageKey="privacy" />} />
        <Route path={ROUTES.terms} element={<StaticPage pageKey="terms" />} />
        <Route path={ROUTES.cookies} element={<StaticPage pageKey="cookies" />} />
        <Route path={ROUTES.medicalDisclaimer} element={<StaticPage pageKey="medicalDisclaimer" />} />
        <Route path={ROUTES.accessibility} element={<StaticPage pageKey="accessibility" />} />

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </main>
      <Footer />
      {showAssistant && (
        <AssistantPanel
          currentMonth={getCurrentMonth()}
          selectedMonth={
            location.pathname.startsWith('/month/')
              ? Number(location.pathname.split('/')[2])
              : null
          }
        />
      )}
    </div>
  );
}

function CommunityTabRoute({ currentMonth }) {
  const { tab } = useParams();
  if (!isCommunityTab(tab)) {
    return <Navigate to={ROUTES.communityTab('feed')} replace />;
  }
  return <Community currentMonth={currentMonth} tab={tab} />;
}

export default App;
