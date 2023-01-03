import {ContextProvider} from '../components/context';

const defaultLang = 'cn';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ContextProvider lang={defaultLang}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
