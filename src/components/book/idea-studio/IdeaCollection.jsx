import IdeaCard from './IdeaCard';

function IdeaCollection({
  collection,
  ideasById,
  onOpenIdea,
  generating,
}) {
  const ideas = collection.ideaIds
    .map((id) => ideasById[id])
    .filter(Boolean);

  return (
    <section className="idea-collection" aria-labelledby={`collection-${collection.id}`}>
      <header className="idea-collection__head">
        <h2 id={`collection-${collection.id}`} className="idea-collection__title">
          {collection.heading}
        </h2>
        <p className="idea-collection__sub baby-book-section-sub">{collection.supporting}</p>
      </header>
      <div className="idea-collection__grid">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            generating={generating}
            onPrimaryAction={onOpenIdea}
            onCta={onOpenIdea}
          />
        ))}
      </div>
    </section>
  );
}

export default IdeaCollection;