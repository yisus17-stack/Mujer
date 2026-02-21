import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initializeFirebase, FirebaseClientProvider } from "@/firebase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evento Mujer Maravatío 2026",
  description: "Rodamos juntas, crecemos juntas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { app, auth, db } = initializeFirebase();

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FirebaseClientProvider firebaseApp={app} auth={auth} firestore={db}>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}