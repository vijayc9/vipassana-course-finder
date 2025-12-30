import './globals.css'

export const metadata = {
  title: 'Vipassana Course Finder',
  description: 'Find and book Vipassana meditation courses near you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-pattern min-h-screen">
        {children}
      </body>
    </html>
  )
}


