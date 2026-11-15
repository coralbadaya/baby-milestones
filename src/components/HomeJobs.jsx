import { Link } from 'react-router-dom';
import Icon from './Icon';
import { HOME_JOBS, HOMEPAGE_COPY } from '../data/homepageCopy';
import { interact } from '../utils/haptics';

function HomeJobs() {
  return (
    <nav className="home-jobs" aria-label="What Yarn Trails does">
      <p className="home-jobs__purpose">{HOMEPAGE_COPY.purpose}</p>
      <ul className="home-jobs__list">
        {HOME_JOBS.map((job) => (
          <li key={job.to}>
            <Link
              to={job.to}
              className={`home-jobs__link${job.label === 'Plus' ? ' home-jobs__link--plus' : ''}`}
              onClick={() => interact('tap', 'light')}
            >
              <Icon name={job.icon} size={22} />
              <span className="home-jobs__copy">
                <span className="home-jobs__label">{job.label}</span>
                <span className="home-jobs__detail">{job.detail}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HomeJobs;
