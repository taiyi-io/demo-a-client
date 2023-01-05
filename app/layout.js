import { ContextProvider } from '../components/context';
import Boot from './bootstrap';

const defaultLang = 'cn';
const defaultUser = 'demo';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Boot />
        <ContextProvider lang={defaultLang} user={defaultUser}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
