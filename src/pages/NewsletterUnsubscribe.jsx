import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { ROUTES } from '../routes';
import { BRAND_NAME } from '../constants/brand';
import { usePageMeta } from '../utils/pageMeta';

function NewsletterUnsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  usePageMeta({
    title: 'Unsubscribe',
    description: `Manage your ${BRAND_NAME} newsletter preferences.`,
  });

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This unsubscribe link is invalid.');
      return;
    }

    supabase.rpc('unsubscribe_newsletter', { p_token: token }).then(({ data, error }) => {
      if (error || !data?.success) {
        setStatus('error');
        setMessage('This unsubscribe link is invalid or has expired.');
        return;
      }
      setStatus('done');
      setMessage(
        data.already_unsubscribed
          ? 'You were already unsubscribed from our list.'
          : 'You have been unsubscribed. We will not send further newsletter emails to this address.',
      );
    });
  }, [token]);

  return (
    <div className="page-body page-body--narrow fade-in">
      <h1 className="font-display">Newsletter preferences</h1>
      {status === 'loading' ? (
        <p>Updating your preferences…</p>
      ) : (
        <>
          <p role="status">{message}</p>
          <p>
            <Link to={ROUTES.home}>Return to {BRAND_NAME}</Link>
          </p>
        </>
      )}
    </div>
  );
}

export default NewsletterUnsubscribe;
