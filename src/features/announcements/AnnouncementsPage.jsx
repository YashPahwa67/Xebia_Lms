import { PageHeader } from '@/components/ui/PageHeader';
import { AnnouncementsPanel } from '@/components/dash/AnnouncementsPanel';
import { useAuth } from '@/features/auth/AuthContext';

export default function AnnouncementsPage() {
  const { role } = useAuth();
  const canPost = role !== 'Student';
  return (
    <div className="space-y-5 pt-2">
      <PageHeader
        title="Announcements"
        subtitle={canPost ? 'Post and view announcements' : 'Updates from your teachers and the institution'}
      />
      <AnnouncementsPanel limit={50} />
    </div>
  );
}
