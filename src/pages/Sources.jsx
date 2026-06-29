import { useState } from 'react';
import sources from '../data/sources';
import { interact } from '../utils/haptics';
import Icon from '../components/Icon';
import { usePageMeta } from '../utils/pageMeta';

function TabButton({ active, onClick, icon, children }) {
  return (
    <button type="button" className={active ? 'active' : ''} onClick={onClick}>
      <Icon name={icon} size={16} /> {children}
    </button>
  );
}

function Sources() {
  usePageMeta({
    title: 'Medical Sources & Citations',
    description: 'The recognized medical authorities and citations behind Nestbean\u2019s milestones and guidance.',
  });
  const [activeTab, setActiveTab] = useState('global');
  const [expandedSource, setExpandedSource] = useState(null);
  const [expandedCitation, setExpandedCitation] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedSource(null);
    interact('tap', 'selection');
  };

  const toggleSource = (id) => {
    setExpandedSource(expandedSource === id ? null : id);
    interact('tap', 'light');
  };

  const toggleCitation = (idx) => {
    setExpandedCitation(expandedCitation === idx ? null : idx);
    interact('tap', 'light');
  };

  const currentSources = activeTab === 'global' ? sources.global :
    activeTab === 'indian' ? sources.indian : null;

  return (
    <div className="sources-page fade-in">
      <div className="sources-hero">
        <Icon name="books" size={48} className="sources-hero-icon" />
        <h1>Medical Sources & Citations</h1>
        <p>All milestones in this app are based on evidence from these globally and nationally recognized medical authorities.</p>
      </div>

      <div className="sources-tabs">
        <TabButton active={activeTab === 'global'} onClick={() => handleTabChange('global')} icon="globe">
          Global Sources
        </TabButton>
        <TabButton active={activeTab === 'indian'} onClick={() => handleTabChange('indian')} icon="1f1ee-1f1f3">
          Indian Sources
        </TabButton>
        <TabButton active={activeTab === 'tools'} onClick={() => handleTabChange('tools')} icon="clipboard">
          Screening Tools
        </TabButton>
        <TabButton active={activeTab === 'citations'} onClick={() => handleTabChange('citations')} icon="link">
          Milestone Citations
        </TabButton>
      </div>

      {currentSources && (
        <div className="sources-list">
          {currentSources.map((source) => (
            <div
              key={source.id}
              className={`source-card ${expandedSource === source.id ? 'expanded' : ''}`}
              onClick={() => toggleSource(source.id)}
            >
              <div className="source-card-header">
                <div className="source-icon-wrap" style={{ background: source.color + '20', color: source.color }}>
                  <Icon name={source.icon} size={28} />
                </div>
                <div className="source-info">
                  <h3>{source.name}</h3>
                  <span className="source-type">{source.type}</span>
                </div>
                <span className={`expand-arrow ${expandedSource === source.id ? 'open' : ''}`}>▾</span>
              </div>

              {expandedSource === source.id && (
                <div className="source-details fade-in">
                  <p className="source-desc">{source.description}</p>

                  <div className="source-pubs">
                    <h4>Key Publications & Guidelines</h4>
                    <ul>
                      {source.publications.map((pub, i) => (
                        <li key={i}>{pub}</li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Official Website →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="tools-list">
          {sources.screeningTools.map((tool, i) => (
            <div key={i} className="tool-card">
              <div className="tool-header">
                <h3>{tool.name}</h3>
                <span className="tool-age">{tool.ageRange}</span>
              </div>
              <span className="tool-origin">{tool.origin}</span>
              <p>{tool.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'citations' && (
        <div className="citations-section">
          <div className="citation-group">
            <h2 className="section-heading-with-icon">
              <Icon name="flexed-bicep" size={22} /> Physical Milestone Citations
            </h2>
            {sources.citations.physical.map((cite, i) => (
              <div
                key={i}
                className={`citation-card ${expandedCitation === `p${i}` ? 'expanded' : ''}`}
                onClick={() => toggleCitation(`p${i}`)}
              >
                <div className="citation-header">
                  <h4>{cite.milestone}</h4>
                  <span className={`expand-arrow ${expandedCitation === `p${i}` ? 'open' : ''}`}>▾</span>
                </div>
                {expandedCitation === `p${i}` && (
                  <div className="citation-details fade-in">
                    <div className="citation-sources">
                      <strong>Sources:</strong>
                      <ul>
                        {cite.sources.map((s, j) => <li key={j}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="citation-note">
                      <strong>Clinical Note:</strong> {cite.note}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="citation-group">
            <h2 className="section-heading-with-icon">
              <Icon name="brain" size={22} /> Emotional & Cognitive Citations
            </h2>
            {sources.citations.emotional.map((cite, i) => (
              <div
                key={i}
                className={`citation-card ${expandedCitation === `e${i}` ? 'expanded' : ''}`}
                onClick={() => toggleCitation(`e${i}`)}
              >
                <div className="citation-header">
                  <h4>{cite.milestone}</h4>
                  <span className={`expand-arrow ${expandedCitation === `e${i}` ? 'open' : ''}`}>▾</span>
                </div>
                {expandedCitation === `e${i}` && (
                  <div className="citation-details fade-in">
                    <div className="citation-sources">
                      <strong>Sources:</strong>
                      <ul>
                        {cite.sources.map((s, j) => <li key={j}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="citation-note">
                      <strong>Clinical Note:</strong> {cite.note}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sources-disclaimer">
        <Icon name="medical" size={32} className="disclaimer-icon" />
        <p>
          This app provides educational information only and is not a substitute for professional medical advice,
          diagnosis, or treatment. Always consult your pediatrician for concerns about your child&apos;s development.
        </p>
      </div>
    </div>
  );
}

export default Sources;
