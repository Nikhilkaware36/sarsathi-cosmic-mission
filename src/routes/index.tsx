import { createFileRoute } from "@tanstack/react-router";
import CinematicIntro from '@/features/intro/CinematicIntro';

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "GOD'S EYE — See What the Eye Cannot | Team Drishti" },
    { name: 'description', content: "Enter GOD'S EYE: a cinematic radar intelligence experience exploring Mumbai's hidden changes with Team Drishti." },
    { property: 'og:title', content: "GOD'S EYE — See What the Eye Cannot" },
    { property: 'og:description', content: 'A 30-second scientific awakening and independent NASA Space Apps project by Team Drishti.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: CinematicIntro,
});
