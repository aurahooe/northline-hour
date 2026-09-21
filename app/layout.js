import "./globals.css";

export const metadata = {
  title: "Northline",
  description: "A room that changes with the hour."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="shell">
          <header className="top">
            <a className="mark" href="/">Northline</a>
            <nav>
              <a href="/">Hour</a>
              <a href="/desk">Desk</a>
              <a href="/login">Enter</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
