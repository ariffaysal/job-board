import './globals.css'; // Make sure this line exists!
import { Inter } from 'next/font/google'; // Import the font

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}> {/* Apply the font here */}
        {children}
      </body>
    </html>
  );
}