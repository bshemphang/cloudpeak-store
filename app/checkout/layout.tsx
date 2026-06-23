import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout | Cloudpeak',
  description: 'Securely check out and prebook your streetwear drops and POD apparel on Cloudpeak.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
