import "./globals.css";

export const metadata = {
  title: "Peer Pockets — Small Capital. Real Businesses.",
  description: "Peer Pockets connects young and micro entrepreneurs in Ghana with supporters who fund clear, itemized business needs.",
  icons: { icon: "/images/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
