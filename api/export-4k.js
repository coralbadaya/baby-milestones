/**
 * Queue 4K export for Plus users (stub — wire render pipeline in production).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { storyId } = req.body || {};
  if (!storyId) {
    res.status(400).json({ error: 'storyId required' });
    return;
  }

  res.status(202).json({
    ok: true,
    message: 'Export queued — you will receive a download link by email when ready.',
    storyId,
  });
}
