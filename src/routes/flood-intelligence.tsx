import { createFileRoute } from '@tanstack/react-router';
import MissionDashboard from '@/features/intro/MissionDashboard';
export const Route = createFileRoute('/flood-intelligence')({
  head: () => ({ meta: [
    { title: "Flood Intelligence | GOD'S EYE" },
    { name: 'description', content: 'Explore a clearly labelled simulated Mumbai flood monitoring scenario.' },
    { property: 'og:title', content: "Flood Intelligence | GOD'S EYE" },
    { property: 'og:description', content: 'Explore a clearly labelled simulated Mumbai flood monitoring scenario.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <MissionDashboard view="flood" />,
});
