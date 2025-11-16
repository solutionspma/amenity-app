import ProfileClient from './ProfileClient';

// Required for static export
export async function generateStaticParams() {
  // Generate some example profile IDs for static build
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'pastor' },
    { id: 'admin' },
  ];
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Server component wrapper: renders client component for interactive UI
  return <ProfileClient id={params.id} />;
}
