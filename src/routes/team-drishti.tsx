import { createFileRoute } from '@tanstack/react-router';
import MissionDashboard from '@/features/intro/MissionDashboard';
export const Route = createFileRoute('/team-drishti')({
  head: () => ({ meta: [
    { title: "Team Drishti | GOD'S EYE" },
    { name: 'description', content: "Meet the five members behind the independent GOD'S EYE Space Apps project." },
    { property: 'og:title', content: "Team Drishti | GOD'S EYE" },
    { property: 'og:description', content: "Meet the five members behind the independent GOD'S EYE Space Apps project." },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <MissionDashboard view="team" />,
});
