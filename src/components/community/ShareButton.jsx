import { useState } from 'react';
import Icon from '../Icon';
import { interact } from '../../utils/haptics';
import { buildSharePayload, copyShareText } from '../../utils/shareLinks';

const HAS_NATIVE_SHARE = typeof navigator !== 'undefined' && Boolean(navigator.share);

/**
 * @param {{ title: string, text?: string, url?: string, compact?: boolean, label?: string }} props
 */
function ShareButton({ title, text, url, compact = false, label }) {
  const [copied, setCopied] = useState(false);
  const payload = buildSharePayload({ title, text, url });

  const openLink = (href) => {
    interact('tap', 'light');
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    interact('tap', 'light');
    if (navigator.share) {
      try {
        await navigator.share({ title, text: payload.text, url: payload.url });
        return;
      } catch {
        /* cancelled */
      }
    }
  };

  const handleCopy = async () => {
    try {
      await copyShareText({ title, text, url });
      interact('check', 'success');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      interact('tap', 'error');
    }
  };

  const handleCompact = async () => {
    if (HAS_NATIVE_SHARE) {
      await handleNativeShare();
      return;
    }
    await handleCopy();
  };

  if (compact) {
    return (
      <button
        type="button"
        className="share-icon-btn share-icon-btn--compact"
        onClick={handleCompact}
        aria-label="Share"
      >
        <Icon name="share" size={18} />
      </button>
    );
  }

  const actions = [
    HAS_NATIVE_SHARE && {
      key: 'native',
      icon: 'share',
      label: 'Share',
      className: 'share-icon-btn--native',
      onClick: handleNativeShare,
    },
    {
      key: 'whatsapp',
      icon: 'whatsapp',
      label: 'Share on WhatsApp',
      className: 'share-icon-btn--whatsapp',
      onClick: () => openLink(payload.whatsapp),
    },
    {
      key: 'x',
      icon: 'x',
      label: 'Share on X',
      className: 'share-icon-btn--x',
      onClick: () => openLink(payload.twitter),
    },
    {
      key: 'facebook',
      icon: 'facebook',
      label: 'Share on Facebook',
      className: 'share-icon-btn--facebook',
      onClick: () => openLink(payload.facebook),
    },
    {
      key: 'copy',
      icon: copied ? 'check' : 'link',
      label: copied ? 'Link copied' : 'Copy link',
      className: 'share-icon-btn--copy',
      onClick: handleCopy,
    },
  ].filter(Boolean);

  return (
    <div className="share-block">
      {label && <p className="share-block-label">{label}</p>}
      <div className="share-icon-row" role="group" aria-label={label || 'Share options'}>
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`share-icon-btn ${action.className}`}
            onClick={action.onClick}
            aria-label={action.label}
          >
            <Icon name={action.icon} size={20} label={action.label} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ShareButton;
