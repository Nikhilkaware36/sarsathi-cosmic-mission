import { createFileRoute } from '@tanstack/react-router';
import MissionDashboard from '@/features/intro/MissionDashboard';
export const Route = createFileRoute('/wetland-intelligence')({
  head: () => ({ meta: [
    { title: "Wetland Intelligence | GOD'S EYE" },
    { name: 'description', content: 'Compare fictional coastal wetland scenarios around Mumbai.' },
    { property: 'og:title', content: "Wetland Intelligence | GOD'S EYE" },
    { property: 'og:description', content: 'Compare fictional coastal wetland scenarios around Mumbai.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <MissionDashboard view="wetland" />,
});
