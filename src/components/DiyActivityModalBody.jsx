import Icon from './Icon';
import { parseYouTubeEmbedUrl, isYouTubeSearchUrl } from '../utils/youtube';

/**
 * Shared body for the DIY "Open guide" modal — used on cards and admin preview.
 * @param {{
 *   activity: {
 *     materials: string[],
 *     steps: string[],
 *     benefits: string[],
 *     whyItWorks: string,
 *     videoSearch: string,
 *   },
 *   image?: import('react').ReactNode,
 * }} props
 */
function DiyActivityModalBody({ activity, image }) {
  const embed = parseYouTubeEmbedUrl(activity.videoSearch);
  const isSearch = isYouTubeSearchUrl(activity.videoSearch);

  const openVideo = () => {
    if (!activity.videoSearch) return;
    window.open(activity.videoSearch, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {image ? (
        <div className="diy-illustration-wrap">
          {image}
        </div>
      ) : null}

      <div className="diy-section">
        <h5 className="diy-section-title"><Icon name="shopping-cart" size={16} /> What You Need</h5>
        <div className="diy-materials">
          {activity.materials.map((m, i) => (
            <span key={i} className="diy-material-chip">{m}</span>
          ))}
        </div>
      </div>

      <div className="diy-section">
        <h5 className="diy-section-title"><Icon name="clipboard" size={16} /> How To Play</h5>
        <ol className="diy-steps">
          {activity.steps.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="diy-two-col">
        <div className="diy-section">
          <h5 className="diy-section-title"><Icon name="check-mark" size={16} /> Benefits</h5>
          <ul className="diy-benefits">
            {activity.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="diy-section diy-why">
          <h5 className="diy-section-title"><Icon name="microscope" size={16} /> Why It Works</h5>
          <p>{activity.whyItWorks}</p>
        </div>
      </div>

      {activity.videoSearch ? (
        <div className="diy-video-panel">
          {embed ? (
            <>
              <h5 className="diy-section-title"><Icon name="youtube" size={16} /> How-To Video</h5>
              <div className="diy-video-embed">
                <iframe
                  src={embed.embedUrl}
                  title={`${activity.name} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </>
          ) : isSearch ? (
            <>
              <p className="diy-video-disclosure">
                Third-party videos — not vetted by Nestbean. Results open on YouTube.
              </p>
              <button type="button" className="diy-video-btn diy-video-btn--secondary" onClick={openVideo}>
                <Icon name="youtube" size={18} className="yt-icon" />
                Browse how-to videos on YouTube
              </button>
            </>
          ) : (
            <button type="button" className="diy-video-btn" onClick={openVideo}>
              <Icon name="youtube" size={18} className="yt-icon" />
              Watch How-To Videos on YouTube
            </button>
          )}
        </div>
      ) : (
        <p className="diy-modal-empty-video">No YouTube link set.</p>
      )}
    </>
  );
}

export default DiyActivityModalBody;
