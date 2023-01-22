import ChainProvider from '../components/chain_provider';
import { ChainConnector } from '../components/chain_sdk';
import { ContextData, ContextProvider } from '../components/context';
import { REQUEST_SCHEMA_NAME, SchemaProperties } from '../components/verify_request';
import Boot from './bootstrap';

let npmPackage = require("../package.json");

const version = npmPackage.version;

async function ensureSchema(conn: ChainConnector) {
  let hasSchema = await conn.hasSchema(REQUEST_SCHEMA_NAME);
  if (!hasSchema) {
    let defines = SchemaProperties();
    await conn.createSchema(REQUEST_SCHEMA_NAME, defines);
    console.log('schema %s initialized', REQUEST_SCHEMA_NAME);
  }
}

export default async function RootLayout({ children }) {
  const defaultContext: ContextData = {
    lang: 'cn',
    user: 'demo.corp_a',
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
