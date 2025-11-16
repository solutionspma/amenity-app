import ProfileClient from '../[id]/ProfileClient';

export default function MeProfilePage() {
  // Renders the current user's profile (client handles 'me' specially)
  return <ProfileClient id={'me'} />;
}
