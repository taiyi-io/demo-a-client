import {ContextProvider} from '../components/context';

const defaultLang = 'cn';
const defaultUser = 'demo';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ContextProvider lang={defaultLang} user={defaultUser}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
