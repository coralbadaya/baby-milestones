import { useRef, useState } from 'react';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import { BRAND_NAME } from '../constants/brand';
import { usePageMeta } from '../utils/pageMeta';
import { trackEvent } from '../utils/analytics';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function MilestoneCardsTool() {
  usePageMeta({
    title: 'Free Printable Milestone Cards',
    description: 'Download printable monthly milestone cards for baby photos — free tool from Nestbean.',
  });

  const canvasRef = useRef(null);
  const [month, setMonth] = useState(1);
  const [name, setName] = useState('');

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const w = 1200;
    const h = 1500;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = '#f7f3ed';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#c4a484';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.fillStyle = '#3d2c29';
    ctx.font = '48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${month} Month${month === 1 ? '' : 's'}`, w / 2, h * 0.35);
    if (name.trim()) {
      ctx.font = '36px Georgia, serif';
      ctx.fillText(name.trim(), w / 2, h * 0.45);
    }
    ctx.font = '28px Georgia, serif';
    ctx.fillStyle = '#6b5b54';
    ctx.fillText(BRAND_NAME, w / 2, h * 0.88);

    return canvas.toDataURL('image/png');
  };

  const download = () => {
    const url = drawCard();
    if (!url) return;
    trackEvent('milestone_card_download', { month });
    const a = document.createElement('a');
    a.href = url;
    a.download = `nestbean-milestone-${month}-months.png`;
    a.click();
  };

  return (
    <div className="milestone-cards-tool">
      <PageHero
        imageKey="baby"
        layout="split"
        eyebrow="Free tool"
        title="Printable milestone cards"
        subtitle="Monthly photo signs for the first year — download and print at home."
        size="md"
      />
      <PageSection surface="white" width="narrow" className="page-body--with-mobile-nav">
        <label className="milestone-cards-tool__field">
          <span>Month (1–12)</span>
          <select
            className="coral-select-native"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m} month{m === 1 ? '' : 's'}</option>
            ))}
          </select>
        </label>
        <label className="milestone-cards-tool__field">
          <span>Baby name (optional)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Their name"
          />
        </label>
        <button type="button" className="btn-primary" onClick={download}>
          Download PNG
        </button>
        <canvas ref={canvasRef} className="milestone-cards-tool__canvas" aria-hidden />
        <p className="milestone-cards-tool__note">
          Turn the same months into AI story pages in My Baby — one full story free on Basic.
        </p>
      </PageSection>
    </div>
  );
}

export default MilestoneCardsTool;
