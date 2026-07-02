const STEPS = [
  { n: '1', title: 'Choose your language', desc: 'Twelve native retellings — culturally adapted, not translated.' },
  { n: '2', title: 'Generate this chapter', desc: 'We weave your baby\'s month into an illustrated story.' },
  { n: '3', title: 'Narrate in your voice', desc: 'Record once — AI reads every story in your language.' },
];

function StoryHowItWorks() {
  return (
    <section className="baby-book-studio__section" aria-labelledby="story-how-heading">
      <h3 id="story-how-heading" className="baby-book-studio__section-title">How it works</h3>
      <ol className="baby-book-steps">
        {STEPS.map((step) => (
          <li key={step.n} className="baby-book-steps__item baby-book-glass">
            <span className="baby-book-steps__num">{step.n}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default StoryHowItWorks;
