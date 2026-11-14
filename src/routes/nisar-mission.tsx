import { createFileRoute } from '@tanstack/react-router';
import MissionDashboard from '@/features/intro/MissionDashboard';
export const Route = createFileRoute('/nisar-mission')({
  head: () => ({ meta: [
    { title: "NISAR Mission | GOD'S EYE" },
    { name: 'description', content: 'Learn about NASA–ISRO radar observation and access authentic mission resources.' },
    { property: 'og:title', content: "NISAR Mission | GOD'S EYE" },
    { property: 'og:description', content: 'Learn about NASA–ISRO radar observation and access authentic mission resources.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <MissionDashboard view="nisar" />,
});
