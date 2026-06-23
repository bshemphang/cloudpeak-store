import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Cloudpeak',
  description: 'Manage your Cloudpeak address book, order history, and preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
