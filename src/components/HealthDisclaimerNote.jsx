import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

function HealthDisclaimerNote() {
  return (
    <p className="health-disclaimer-note">
      Educational guidance, not a diagnosis.{' '}
      <Link to={ROUTES.medicalDisclaimer}>Medical disclaimer</Link>
    </p>
  );
}

export default HealthDisclaimerNote;
