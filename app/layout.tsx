import ChainProvider from '../components/chain_provider';
import { ChainConnector } from '../components/chain_sdk';
import { ContextData, ContextProvider } from '../components/context';
import { SchemaName, SchemaProperties } from '../components/verify_request';
import Boot from './bootstrap';

let npmPackage = require("../package.json");

const version = npmPackage.version;

async function ensureSchema(conn: ChainConnector) {
  let hasSchema = await conn.hasSchema(SchemaName);
  if (!hasSchema) {
    let defines = SchemaProperties();
    await conn.createSchema(SchemaName, defines);
    console.log('schema %s initialized', SchemaName);
  }
}

export default async function RootLayout({ children }) {
  const defaultContext: ContextData = {
    lang: 'cn',
    user: 'demo',
    version: version,
  }
  
  let conn = await ChainProvider.connect();
  await ensureSchema(conn);
  
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
