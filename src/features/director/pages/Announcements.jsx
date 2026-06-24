import { PageHeader } from '@/components/ui/PageHeader';
import { AnnouncementsPanel } from '@/components/dash/AnnouncementsPanel';

export default function DirectorAnnouncements() {
  return (
    <div className="space-y-5 pt-2">
      <PageHeader title="Announcements" subtitle="Broadcast to the institution" />
      <AnnouncementsPanel limit={50} />
    </div>
  );
}
