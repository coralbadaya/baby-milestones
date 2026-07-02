function StoryQuotaChip({ isPlus, storiesRemaining }) {
  const label = isPlus
    ? 'Unlimited stories on Plus'
    : storiesRemaining === 1
      ? '1 free story included'
      : storiesRemaining === 0
        ? 'Free story used — upgrade for unlimited'
        : `${storiesRemaining} free ${storiesRemaining === 1 ? 'story' : 'stories'} left`;

  return (
    <span className={`baby-book-quota-chip${isPlus ? ' baby-book-quota-chip--plus' : ''}`}>
      {label}
    </span>
  );
}

export default StoryQuotaChip;
