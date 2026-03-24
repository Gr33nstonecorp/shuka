import "./globals.css";

export const metadata = {
  title: "ShukAI",
  description: "AI-powered procurement platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
