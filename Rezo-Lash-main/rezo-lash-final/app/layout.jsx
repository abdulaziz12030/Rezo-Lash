
import './globals.css'

export const metadata = {
  title: 'Rezo Lash',
  description: 'Luxury Lash Booking'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
