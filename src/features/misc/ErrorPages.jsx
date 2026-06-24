import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MeshBlobs, GridOverlay } from '@/components/marketing/Backdrops';

function CenteredCard({ icon: Icon, code, title, message, action }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4">
      <MeshBlobs className="opacity-50" />
      <GridOverlay />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-line/70 bg-white p-10 text-center shadow-glow">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-plum/[0.07] text-plum">
          <Icon className="h-7 w-7" />
        </span>
        <p className="mt-5 font-display text-5xl font-bold tracking-tightest text-gradient">{code}</p>
        <h1 className="mt-2 text-xl font-semibold text-ink">{title}</h1>
        <p className="mt-1.5 text-sm text-slate/70">{message}</p>
        <div className="mt-6 flex justify-center">{action}</div>
      </div>
    </div>
  );
}

export function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <CenteredCard
      icon={ShieldAlert}
      code="403"
      title="Access denied"
      message="You don't have permission to view this page."
      action={<Button onClick={() => navigate(-1)}>Go back</Button>}
    />
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <CenteredCard
      icon={Compass}
      code="404"
      title="Page not found"
      message="The page you're looking for doesn't exist or has moved."
      action={<Button onClick={() => navigate('/')}>Go home</Button>}
    />
  );
}
