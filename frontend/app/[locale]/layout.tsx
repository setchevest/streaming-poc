import { QueryProvider } from '../components/providers/QueryProvider';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
