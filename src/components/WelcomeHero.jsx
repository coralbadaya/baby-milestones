import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import TrustStrip from './TrustStrip';
import { NESTBEAN_WATERMARK_SRC } from '../constants/brandAssets';
import { pageImages } from '../data/pageImages';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';

/**
 * First-visit hero — dedicated layout (avoids split PageHero mobile conflicts).
 */
function WelcomeHero({ birthDate, setBirthDate, onLocalPreview }) {
  const config = pageImages.home;

  return (
    <section className="welcome-hero" aria-labelledby="welcome-hero-title">
      <div className="welcome-hero__media" aria-hidden="true">
        <ImageWithFallback
          className="welcome-hero__image-wrap"
          imgClassName="welcome-hero__image"
          src={config.src}
          watermarkSrc={NESTBEAN_WATERMARK_SRC}
          alt=""
          fallbackGradient={config.fallbackGradient}
          loading="eager"
          fetchPriority="high"
          imgStyle={config.objectPosition ? { objectPosition: config.objectPosition } : undefined}
        />
        <div className="welcome-hero__scrim" />
      </div>

      <div className="welcome-hero__body">
        <div className="welcome-hero__copy">
          <p className="welcome-hero__eyebrow">For new mothers</p>
          <h1 id="welcome-hero-title" className="welcome-hero__title font-display">
            Nestbean
          </h1>
          <p className="welcome-hero__subtitle">
            Week-by-week guides, milestones, and routines for your baby&apos;s first year.
          </p>

          <div className="welcome-hero__actions">
            <Link
              to={ROUTES.signup}
              className="btn-primary welcome-hero__cta"
              onClick={() => interact('tap', 'light')}
            >
              Create free account
            </Link>
            <button type="button" className="btn-ghost welcome-hero__cta" onClick={onLocalPreview}>
              Preview without an account
            </button>
          </div>

          <div className="welcome-hero__personalize">
            <p className="welcome-hero__or">Or personalize with birth date</p>
            <div className="birth-date-form birth-date-form--welcome">
              <label htmlFor="welcome-birthdate">Baby&apos;s birth date</label>
              <input
                type="date"
                id="welcome-birthdate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <TrustStrip className="trust-strip--welcome" showPrivacyNote />
        </div>
      </div>
    </section>
  );
}

export default WelcomeHero;
