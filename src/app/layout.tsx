import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ResponsiveWrapper from './components/ResponsiveWrapper'; // ⬅️ 確認路徑正確

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Worker Test',
  description: 'A personality quiz for workers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
      >
                {/* 🔊 背景音樂區塊 */}
                <audio autoPlay loop controls={false} style={{ display: 'none' }}>
          <source src="/bg-music.mp3" type="audio/mpeg" />
        </audio>
        <ResponsiveWrapper>{children}</ResponsiveWrapper>
      </body>
    </html>
  );
}


