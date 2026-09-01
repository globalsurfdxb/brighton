export const metadata = {
  title: "Brighton | Backend Console",
  description: "Brighton",
};

import "../../../globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" className={`antialiased`}>
      {children}
    </div>
  );
}
