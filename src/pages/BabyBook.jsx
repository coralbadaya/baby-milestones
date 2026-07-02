import { Navigate, useParams } from 'react-router-dom';
import { usePageMeta } from '../utils/pageMeta';
import { resolveBabyDisplayName } from '../utils/babyName';
import { useAuth } from '../context/AuthContext';
import BabyBookShell from '../components/book/BabyBookShell';

const VALID_TABS = ['home', 'stories', 'ideas', 'book', 'family'];

function BabyBook({ birthDate, currentMonth, firstMoments, babyName: babyNameProp }) {
  const { tab } = useParams();
  const { profile } = useAuth();
  const activeTab = tab || 'home';
  const babyName = resolveBabyDisplayName(babyNameProp, profile?.display_name);

  usePageMeta({
    title: 'Baby Book',
    description: 'AI stories in your language, photo-book ideas, 3D flip-book, and family voice blessings.',
  });

  if (tab && !VALID_TABS.includes(tab)) {
    return <Navigate to="/baby/book/home" replace />;
  }

  return (
    <BabyBookShell
      activeTab={activeTab}
      birthDate={birthDate}
      babyName={babyName}
      currentMonth={currentMonth}
      firstMoments={firstMoments}
    />
  );
}

export default BabyBook;
