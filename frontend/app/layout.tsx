import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechMart VN - Siêu thị công nghệ hàng đầu Việt Nam',
  description: 'Điện thoại, laptop, máy tính bảng, phụ kiện chính hãng từ Samsung, Apple, Xiaomi, OPPO, Sony. Giá tốt nhất, giao hàng nhanh.',
  keywords: 'điện thoại, laptop, máy tính bảng, Samsung, Apple, Xiaomi, OPPO, Sony, TechMart, công nghệ Việt Nam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
