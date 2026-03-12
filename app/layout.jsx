import "./globals.css";

export const metadata = {
  title: "Rezo Lash",
  description: "Luxury private lash booking studio"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
