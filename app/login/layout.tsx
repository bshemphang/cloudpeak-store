import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Cloudpeak',
  description: 'Log in to your Cloudpeak account to manage orders, update shipping details, and access exclusive drops.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
