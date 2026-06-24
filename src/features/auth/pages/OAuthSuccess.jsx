import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';
import { ROLE_HOME } from '@/constants';

// Handles the OAuth provider redirect: /success?token=<JWT>
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const { completeOAuth } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = params.get('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const { role } = completeOAuth(token);
      navigate(ROLE_HOME[role] || '/', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  }, [params, completeOAuth, navigate]);

  return <FullScreenLoader label="Completing sign in…" />;
}
