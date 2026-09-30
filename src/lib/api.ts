export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tech: string;
  year: number;
  client: string;
  featured: boolean;
  stats_text: string;
  live_url: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  skills: string;
  github: string;
  linkedin: string;
  order_index: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar_url: string;
  rating: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const getProjects = (category?: string) => {
  const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return fetch(`/api/projects${q}`).then((r) => handle<Project[]>(r));
};

export const getTeam = () => fetch('/api/team').then((r) => handle<TeamMember[]>(r));

export const getTestimonials = () => fetch('/api/testimonials').then((r) => handle<Testimonial[]>(r));

export const sendMessage = (payload: ContactPayload) =>
  fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => handle(r));
