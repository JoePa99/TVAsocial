import { redirect } from 'next/navigation';

export default function Home() {
  // Homepage just redirects to login
  redirect('/auth/login');
}
