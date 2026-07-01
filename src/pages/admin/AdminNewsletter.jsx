import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Navigate, useBlocker } from 'react-router-dom';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { useEscToClose } from '../../hooks/useEscToClose';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';
import {
  htmlToPlainText,
  renderNewsletterPreview,
  campaignStatusLabel,
  canEditCampaign,
  canScheduleCampaign,
} from '../../utils/newsletter';
import {
  fetchCampaigns,
  fetchTemplates,
  fetchSubscribers,
  countActiveSubscribers,
  createCampaign,
  updateCampaign,
  duplicateCampaign,
  cancelSchedule,
  scheduleCampaign,
  sendCampaignNow,
  saveTemplateFromCampaign,
  updateTemplate,
  deleteTemplate,
  addSubscriberManual,
  fetchCampaignSendStats,
  invokeSendTest,
  subscribersToCsv,
} from '../../utils/newsletterAdmin';

const TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'compose', label: 'Compose' },
  { id: 'templates', label: 'Templates' },
  { id: 'subscribers', label: 'Subscribers' },
];

const CAMPAIGN_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sent', label: 'Sent' },
];

const emptyCampaign = {
  id: null,
  name: '',
  subject: '',
  preview_text: '',
  body_html: '',
  body_text: '',
  template_id: null,
  status: 'draft',
};

const CAMPAIGN_COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
  { key: 'subject', header: 'Subject' },
  { key: 'scheduled', header: 'Scheduled / sent', className: 'admin-cell-date' },
  { key: 'recipients', header: 'Recipients' },
  { key: 'actions', header: 'Actions' },
];

const TEMPLATE_COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'slug', header: 'Slug' },
  { key: 'subject', header: 'Subject' },
  { key: 'system', header: 'System' },
  { key: 'actions', header: 'Actions' },
];

const SUBSCRIBER_COLUMNS = [
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
  { key: 'source', header: 'Source' },
  { key: 'subscribed', header: 'Subscribed', className: 'admin-cell-date' },
];

function StatusBadge({ status }) {
  return <AdminBadge variant={status}>{campaignStatusLabel(status)}</AdminBadge>;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AdminNewsletter() {
  const { isAdmin, user } = useAuth();
  const [tab, setTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [compose, setCompose] = useState(emptyCampaign);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [previewWidth, setPreviewWidth] = useState('desktop');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleAt, setScheduleAt] = useState('');
  const [statsCampaign, setStatsCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [templateEdit, setTemplateEdit] = useState(null);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({ slug: '', name: '', description: '' });
  const [manualEmail, setManualEmail] = useState('');
  const autosaveRef = useRef(null);
  const savedSnapshot = useRef(JSON.stringify(emptyCampaign));

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, t, s, count] = await Promise.all([
        fetchCampaigns(),
        fetchTemplates(),
        fetchSubscribers(),
        countActiveSubscribers(),
      ]);
      setCampaigns(c);
      setTemplates(t);
      setSubscribers(s);
      setActiveCount(count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filteredCampaigns = useMemo(() => {
    if (campaignFilter === 'all') return campaigns;
    return campaigns.filter((c) => c.status === campaignFilter);
  }, [campaigns, campaignFilter]);

  const previewHtml = useMemo(
    () => renderNewsletterPreview({
      subject: compose.subject,
      bodyHtml: compose.body_html,
    }),
    [compose.subject, compose.body_html],
  );

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      // eslint-disable-next-line no-alert
      const ok = window.confirm('You have unsaved changes. Leave anyway?');
      if (ok) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  const markDirty = (next) => {
    setCompose(next);
    setDirty(JSON.stringify(next) !== savedSnapshot.current);
  };

  const openCompose = (campaign) => {
    const next = campaign
      ? { ...campaign }
      : { ...emptyCampaign, name: `Campaign ${new Date().toLocaleDateString()}` };
    setCompose(next);
    savedSnapshot.current = JSON.stringify(next);
    setDirty(false);
    setTab('compose');
  };

  const persistDraft = useCallback(async (silent = false) => {
    if (!isAdmin || !compose.name.trim()) return null;
    setError(null);
    try {
      const payload = {
        name: compose.name.trim(),
        subject: compose.subject,
        preview_text: compose.preview_text || null,
        body_html: compose.body_html,
        body_text: compose.body_text,
        template_id: compose.template_id,
        status: compose.status === 'cancelled' ? 'draft' : compose.status,
      };

      let saved;
      if (compose.id) {
        if (!canEditCampaign(compose.status)) {
          saved = compose;
        } else {
          saved = await updateCampaign(compose.id, payload);
        }
      } else {
        saved = await createCampaign({ ...payload, status: 'draft', created_by: user?.id });
      }

      const next = { ...compose, ...saved };
      setCompose(next);
      savedSnapshot.current = JSON.stringify(next);
      setDirty(false);
      if (!silent) setNotice('Draft saved.');
      await loadAll();
      return saved;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [compose, isAdmin, loadAll, user?.id]);

  useEffect(() => {
    if (!dirty || !isAdmin || tab !== 'compose') return undefined;
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      persistDraft(true);
    }, 30000);
    return () => clearTimeout(autosaveRef.current);
  }, [dirty, compose, isAdmin, tab, persistDraft]);

  const applyTemplate = (templateId) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl) return;
    const hasContent = compose.subject || compose.body_html;
    if (hasContent && !window.confirm('Replace current content with this template?')) return;
    markDirty({
      ...compose,
      template_id: tmpl.id,
      subject: tmpl.subject,
      preview_text: tmpl.preview_text || '',
      body_html: tmpl.body_html,
      body_text: tmpl.body_text,
    });
  };

  const handleBodyHtmlChange = (value) => {
    markDirty({
      ...compose,
      body_html: value,
      body_text: compose.body_text || htmlToPlainText(value),
    });
  };

  const handleSendSample = async () => {
    interact('tap', 'light');
    setError(null);
    try {
      const saved = await persistDraft(true);
      const id = saved?.id || compose.id;
      await invokeSendTest({
        campaign_id: id,
        subject: compose.subject,
        preview_text: compose.preview_text,
        body_html: compose.body_html,
        body_text: compose.body_text,
      });
      setNotice(`Sample sent to ${user?.email || 'your inbox'}.`);
    } catch (err) {
      setError(err.message || 'Failed to send sample.');
    }
  };

  const confirmSchedule = async (immediate = false) => {
    interact('tap', 'light');
    setError(null);
    try {
      const saved = await persistDraft(true);
      const id = saved?.id || compose.id;
      if (!id) throw new Error('Save draft first');
      if (immediate) {
        await sendCampaignNow(id);
        setNotice('Campaign queued for immediate send.');
      } else {
        if (!scheduleAt) throw new Error('Pick a date and time');
        await scheduleCampaign(id, new Date(scheduleAt).toISOString());
        setNotice('Campaign scheduled.');
      }
      setScheduleOpen(false);
      await loadAll();
      const updated = await fetchCampaigns();
      const current = updated.find((c) => c.id === id);
      if (current) openCompose(current);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelSchedule = async (campaign) => {
    interact('tap', 'light');
    await cancelSchedule(campaign.id);
    await loadAll();
    setNotice('Schedule cancelled — back to draft.');
  };

  const handleDuplicate = async (campaign) => {
    interact('tap', 'light');
    const copy = await duplicateCampaign(campaign);
    await loadAll();
    openCompose(copy);
  };

  const viewStats = async (campaign) => {
    setStatsCampaign(campaign);
    const s = await fetchCampaignSendStats(campaign.id);
    setStats(s);
  };

  const handleSaveAsTemplate = async (e) => {
    e.preventDefault();
    try {
      await saveTemplateFromCampaign(compose, templateForm);
      setSaveTemplateOpen(false);
      setTemplateForm({ slug: '', name: '', description: '' });
      await loadAll();
      setNotice('Template saved.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await addSubscriberManual(manualEmail);
      if (result.duplicate) {
        setNotice('That email is already subscribed.');
      } else {
        setNotice(result.reactivated ? 'Subscriber reactivated.' : 'Subscriber added.');
      }
      setManualEmail('');
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const exportCsv = () => {
    const csv = subscribersToCsv(subscribers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nestbean-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const readOnly = !isAdmin;

  useEscToClose(scheduleOpen, () => setScheduleOpen(false));
  useEscToClose(saveTemplateOpen, () => setSaveTemplateOpen(false));
  useEscToClose(!!templateEdit, () => setTemplateEdit(null));
  useEscToClose(!!statsCampaign, () => { setStatsCampaign(null); setStats(null); });

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Newsletter"
        description={(
          <>
            Compose editorial emails, save drafts, send samples, and schedule delivery to
            {' '}
            <strong>{activeCount}</strong>
            {' '}
            active subscribers.
          </>
        )}
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'Newsletter' }]}
        action={!readOnly ? (
          <button type="button" className="btn-primary" onClick={() => openCompose(null)}>
            New campaign
          </button>
        ) : null}
      />

      <div className="admin-tabs" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`admin-tab${tab === id ? ' active' : ''}`}
            onClick={() => {
              interact('tap', 'light');
              if ((id === 'compose' || id === 'templates') && readOnly) return;
              setTab(id);
              setNotice(null);
            }}
            disabled={(id === 'compose' || id === 'templates') && readOnly}
          >
            {label}
          </button>
        ))}
      </div>

      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}

      {tab === 'campaigns' && (
        <>
          <AdminToolbar
            left={(
              <Select
                id="campaign-filter"
                value={campaignFilter}
                onChange={setCampaignFilter}
                options={CAMPAIGN_FILTERS}
              />
            )}
            onRefresh={loadAll}
          />

          {loading ? (
            <AdminLoading variant="table" message="Loading campaigns…" />
          ) : filteredCampaigns.length === 0 ? (
            <AdminEmpty message="No campaigns yet — start from a template." />
          ) : (
            <AdminPanel padding={false}>
              <AdminDataTable
                columns={CAMPAIGN_COLUMNS}
                rows={filteredCampaigns}
                rowKey={(row) => row.id}
                renderCell={(row, col) => {
                  switch (col.key) {
                    case 'name':
                      return <strong>{row.name}</strong>;
                    case 'status':
                      return <StatusBadge status={row.status} />;
                    case 'subject':
                      return row.subject || '—';
                    case 'scheduled':
                      return row.sent_at ? formatDateTime(row.sent_at) : formatDateTime(row.scheduled_at);
                    case 'recipients':
                      return row.recipient_count || '—';
                    case 'actions':
                      return (
                        <div className="admin-actions">
                          {!readOnly && canEditCampaign(row.status) && (
                            <button type="button" className="btn-ghost" onClick={() => openCompose(row)}>Edit</button>
                          )}
                          {!readOnly && (
                            <button type="button" className="btn-ghost" onClick={() => handleDuplicate(row)}>Duplicate</button>
                          )}
                          {!readOnly && row.status === 'scheduled' && (
                            <button type="button" className="btn-ghost" onClick={() => handleCancelSchedule(row)}>Cancel</button>
                          )}
                          {row.status === 'sent' || row.status === 'sending' ? (
                            <button type="button" className="btn-ghost" onClick={() => viewStats(row)}>Stats</button>
                          ) : null}
                        </div>
                      );
                    default:
                      return null;
                  }
                }}
              />
            </AdminPanel>
          )}
        </>
      )}

      {tab === 'compose' && !readOnly && (
        <AdminPanel padding={false}>
          <div className="admin-newsletter-compose">
            <div className="admin-newsletter-editor admin-panel">
            <div className="admin-toolbar">
              <Select
                id="template-picker"
                value={compose.template_id || ''}
                onChange={(v) => applyTemplate(v)}
                options={[
                  { value: '', label: 'Start from template…' },
                  ...templates.map((t) => ({ value: t.id, label: t.name })),
                ]}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="campaign-name">Internal name</label>
              <input
                id="campaign-name"
                value={compose.name}
                onChange={(e) => markDirty({ ...compose, name: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="campaign-subject">Subject</label>
              <input
                id="campaign-subject"
                value={compose.subject}
                onChange={(e) => markDirty({ ...compose, subject: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="campaign-preview">Preview text</label>
              <input
                id="campaign-preview"
                value={compose.preview_text || ''}
                onChange={(e) => markDirty({ ...compose, preview_text: e.target.value })}
                placeholder="Inbox snippet"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="campaign-html">HTML body</label>
              <textarea
                id="campaign-html"
                className="admin-notes admin-newsletter-html"
                rows={14}
                value={compose.body_html}
                onChange={(e) => handleBodyHtmlChange(e.target.value)}
                disabled={!canEditCampaign(compose.status)}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="campaign-text">Plain text</label>
              <textarea
                id="campaign-text"
                className="admin-notes"
                rows={6}
                value={compose.body_text}
                onChange={(e) => markDirty({ ...compose, body_text: e.target.value })}
                disabled={!canEditCampaign(compose.status)}
              />
            </div>

            <div className="admin-newsletter-actions">
              <button type="button" className="btn-primary" onClick={() => persistDraft()} disabled={!canEditCampaign(compose.status)}>
                Save draft
              </button>
              <button type="button" className="btn-ghost" onClick={handleSendSample} disabled={!compose.body_html}>
                Send sample to me
              </button>
              <button type="button" className="btn-ghost" onClick={() => setSaveTemplateOpen(true)} disabled={!compose.body_html}>
                Save as template
              </button>
              {canScheduleCampaign(compose.status) && (
                <>
                  <button type="button" className="btn-ghost" onClick={() => setScheduleOpen(true)}>
                    Schedule send
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {
                      if (window.confirm(`Send now to ${activeCount} active subscribers?`)) {
                        confirmSchedule(true);
                      }
                    }}
                  >
                    Send now
                  </button>
                </>
              )}
            </div>
            {dirty && <p className="admin-muted">Unsaved changes — auto-saves every 30s.</p>}
          </div>

          <div className="admin-newsletter-preview admin-panel">
            <div className="admin-toolbar">
              <span className="admin-muted">Preview</span>
              <button
                type="button"
                className={`btn-ghost${previewWidth === 'desktop' ? ' active' : ''}`}
                onClick={() => setPreviewWidth('desktop')}
              >
                Desktop
              </button>
              <button
                type="button"
                className={`btn-ghost${previewWidth === 'mobile' ? ' active' : ''}`}
                onClick={() => setPreviewWidth('mobile')}
              >
                Mobile
              </button>
            </div>
            <div
              className={`admin-newsletter-preview-frame admin-newsletter-preview-frame--${previewWidth}`}
            >
              <iframe
                title="Email preview"
                srcDoc={previewHtml}
                sandbox=""
                className="admin-newsletter-preview-iframe"
              />
            </div>
          </div>
        </div>
        </AdminPanel>
      )}

      {tab === 'compose' && readOnly && (
        <Navigate to={ROUTES.adminNewsletter} replace />
      )}

      {tab === 'templates' && !readOnly && (
        <>
          {loading ? (
            <AdminLoading variant="table" message="Loading templates…" />
          ) : templates.length === 0 ? (
            <AdminEmpty message="No templates yet." />
          ) : (
            <AdminPanel padding={false}>
              <AdminDataTable
                columns={TEMPLATE_COLUMNS}
                rows={templates}
                rowKey={(row) => row.id}
                renderCell={(row, col) => {
                  switch (col.key) {
                    case 'name':
                      return <strong>{row.name}</strong>;
                    case 'slug':
                      return row.slug;
                    case 'subject':
                      return row.subject;
                    case 'system':
                      return row.is_system ? 'Yes' : 'No';
                    case 'actions':
                      return (
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => {
                              openCompose({
                                ...emptyCampaign,
                                name: `${row.name} campaign`,
                                template_id: row.id,
                                subject: row.subject,
                                preview_text: row.preview_text,
                                body_html: row.body_html,
                                body_text: row.body_text,
                              });
                            }}
                          >
                            Use
                          </button>
                          {!row.is_system && (
                            <>
                              <button type="button" className="btn-ghost" onClick={() => setTemplateEdit(row)}>Edit</button>
                              <button
                                type="button"
                                className="btn-ghost admin-muted"
                                onClick={async () => {
                                  if (window.confirm('Delete this template?')) {
                                    await deleteTemplate(row.id);
                                    await loadAll();
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      );
                    default:
                      return null;
                  }
                }}
              />
            </AdminPanel>
          )}
        </>
      )}

      {tab === 'templates' && readOnly && (
        <Navigate to={ROUTES.adminNewsletter} replace />
      )}

      {tab === 'subscribers' && (
        <>
          <AdminPanel>
            <div className="admin-stat-grid admin-stat-grid--inline">
              <AdminStatCard value={activeCount} label="Active subscribers" />
              <AdminStatCard value={subscribers.length} label="Total records" />
            </div>
          </AdminPanel>

          {!readOnly && (
            <AdminPanel className="admin-form admin-form--inline">
              <form onSubmit={handleAddSubscriber}>
                <div className="auth-field">
                  <label htmlFor="manual-email">Add subscriber</label>
                  <input
                    id="manual-email"
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Add</button>
              </form>
            </AdminPanel>
          )}

          <AdminToolbar
            left={isAdmin ? (
              <button type="button" className="btn-ghost" onClick={exportCsv}>Export CSV</button>
            ) : null}
            onRefresh={loadAll}
          />

          {loading ? (
            <AdminLoading variant="table" message="Loading subscribers…" />
          ) : subscribers.length === 0 ? (
            <AdminEmpty message="No subscribers yet." />
          ) : (
            <AdminPanel padding={false}>
              <AdminDataTable
                columns={SUBSCRIBER_COLUMNS}
                rows={subscribers}
                rowKey={(row) => row.id}
                renderCell={(row, col) => {
                  switch (col.key) {
                    case 'email':
                      return row.email;
                    case 'status':
                      return <AdminBadge variant={row.status === 'active' ? 'active' : 'neutral'}>{row.status}</AdminBadge>;
                    case 'source':
                      return row.source;
                    case 'subscribed':
                      return formatDateTime(row.subscribed_at);
                    default:
                      return null;
                  }
                }}
              />
            </AdminPanel>
          )}
        </>
      )}

      {scheduleOpen && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setScheduleOpen(false)}>
          <div className="admin-modal card-accent-top" role="dialog" aria-labelledby="schedule-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="schedule-title">Schedule send</h2>
            <p>
              Sending to <strong>{activeCount}</strong> active subscribers on{' '}
              <strong>{scheduleAt ? formatDateTime(scheduleAt) : '…'}</strong>
            </p>
            <div className="auth-field">
              <label htmlFor="schedule-at">Date & time</label>
              <input
                id="schedule-at"
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                required
              />
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="btn-primary" onClick={() => confirmSchedule(false)}>Schedule</button>
              <button type="button" className="btn-ghost" onClick={() => setScheduleOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {saveTemplateOpen && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setSaveTemplateOpen(false)}>
          <form className="admin-modal card-accent-top" onSubmit={handleSaveAsTemplate} onClick={(e) => e.stopPropagation()}>
            <h2>Save as template</h2>
            <div className="auth-field">
              <label htmlFor="tpl-slug">Slug</label>
              <input
                id="tpl-slug"
                required
                value={templateForm.slug}
                onChange={(e) => setTemplateForm({ ...templateForm, slug: e.target.value })}
                placeholder="my-template"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="tpl-name">Name</label>
              <input
                id="tpl-name"
                required
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="tpl-desc">Description</label>
              <input
                id="tpl-desc"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              />
            </div>
            <div className="admin-modal-actions">
              <button type="submit" className="btn-primary">Save template</button>
              <button type="button" className="btn-ghost" onClick={() => setSaveTemplateOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {templateEdit && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setTemplateEdit(null)}>
          <form
            className="admin-modal admin-modal--wide card-accent-top"
            onSubmit={async (e) => {
              e.preventDefault();
              await updateTemplate(templateEdit.id, {
                name: templateEdit.name,
                subject: templateEdit.subject,
                preview_text: templateEdit.preview_text,
                body_html: templateEdit.body_html,
                body_text: templateEdit.body_text,
              });
              setTemplateEdit(null);
              await loadAll();
              setNotice('Template updated.');
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit template</h2>
            <div className="auth-field">
              <label htmlFor="edit-tpl-name">Name</label>
              <input
                id="edit-tpl-name"
                value={templateEdit.name}
                onChange={(e) => setTemplateEdit({ ...templateEdit, name: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="edit-tpl-subject">Subject</label>
              <input
                id="edit-tpl-subject"
                value={templateEdit.subject}
                onChange={(e) => setTemplateEdit({ ...templateEdit, subject: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="edit-tpl-html">HTML body</label>
              <textarea
                id="edit-tpl-html"
                className="admin-notes"
                rows={8}
                value={templateEdit.body_html}
                onChange={(e) => setTemplateEdit({ ...templateEdit, body_html: e.target.value })}
              />
            </div>
            <div className="admin-modal-actions">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-ghost" onClick={() => setTemplateEdit(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {statsCampaign && stats && (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => { setStatsCampaign(null); setStats(null); }}>
          <div className="admin-modal card-accent-top" onClick={(e) => e.stopPropagation()}>
            <h2>Send stats — {statsCampaign.name}</h2>
            <ul className="admin-stats-list">
              <li>Sent: {stats.sent}</li>
              <li>Failed: {stats.failed}</li>
              <li>Queued: {stats.queued}</li>
            </ul>
            <button type="button" className="btn-ghost" onClick={() => { setStatsCampaign(null); setStats(null); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNewsletter;
