import { createFileRoute } from "@tanstack/react-router";
import CinematicIntro from '@/features/intro/CinematicIntro';

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'SARsathi — Dancing with the SARs | Team Drishti' },
    { name: 'description', content: 'Five minds. One mission. Explore our changing planet with SARsathi and Team Drishti.' },
    { property: 'og:title', content: 'SARsathi — Dancing with the SARs' },
    { property: 'og:description', content: 'A cinematic Earth observation mission by Team Drishti.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: CinematicIntro,
});
