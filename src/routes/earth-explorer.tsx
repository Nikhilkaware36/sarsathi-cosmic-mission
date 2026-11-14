import { createFileRoute } from '@tanstack/react-router';
import MissionDashboard from '@/features/intro/MissionDashboard';
export const Route = createFileRoute('/earth-explorer')({
  head: () => ({ meta: [
    { title: "Earth Explorer | GOD'S EYE" },
    { name: 'description', content: 'Interact with Earth, geographic grids and illustrative satellite orbits.' },
    { property: 'og:title', content: "Earth Explorer | GOD'S EYE" },
    { property: 'og:description', content: 'Interact with Earth, geographic grids and illustrative satellite orbits.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <MissionDashboard view="earth" />,
});
