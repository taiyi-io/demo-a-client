import { ContextProvider } from '../components/context';
import Boot from './bootstrap';

const version = 'v0.2.0';

export default function RootLayout({ children }) {
  const defaultContext = {
    lang: 'cn',
    user: 'demo',
    version: version,
  }
  
  return (
    <html>
      <body>
        <Boot />
        <ContextProvider value={defaultContext}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
