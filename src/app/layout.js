import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Satta Kings Pro | Satta King Result | Gali Desawar Satta Result',
  description: 'Satta Kings Pro - Get Fastest Satta result, gali desawar satta result. Satta king chart, Satta king online result, Satta king result today, Gali result.',
  keywords: 'Satta Kings Pro, Satta King, Satta King Result, Gali Result, Desawar Result, Satta Chart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
        <script
          src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
          defer
        ></script>
      </head>
      <body style={{ fontSize: '12px' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
