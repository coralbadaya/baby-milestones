import MomCareTips from '../components/MomCareTips';

function MomCare({ birthDate, momMilestoneChecks, toggleMomMilestone }) {
  return (
    <div className="mom-care-page">
      <MomCareTips
        birthDate={birthDate}
        momMilestoneChecks={momMilestoneChecks}
        toggleMomMilestone={toggleMomMilestone}
      />
    </div>
  );
}

export default MomCare;
