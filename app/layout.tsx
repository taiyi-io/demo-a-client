import ChainProvider from '../components/chain_provider';
import { ChainConnector } from '../components/chain_sdk';
import { ContextData, ContextProvider } from '../components/context';
import { CONTRACT_DEFINE, VERIFY_CONTRACT_NAME } from '../components/verify_asset';
import { REQUEST_SCHEMA_NAME, SchemaProperties } from '../components/verify_request';
import Boot from './bootstrap';
import npmPackage from '../package.json';

const version = npmPackage.version;

async function initialChainEnvironment(conn: ChainConnector) {
  let hasSchema = await conn.hasSchema(REQUEST_SCHEMA_NAME);
  if (!hasSchema) {
    let defines = SchemaProperties();
    await conn.createSchema(REQUEST_SCHEMA_NAME, defines);
    console.log('schema %s initialized', REQUEST_SCHEMA_NAME);
  }
  await conn.deployContract(VERIFY_CONTRACT_NAME, CONTRACT_DEFINE);
  console.log('contract %s deployed', VERIFY_CONTRACT_NAME);
  if (npmPackage.chain.debug){
    await conn.enableContractTrace(VERIFY_CONTRACT_NAME);
    console.log('trace flag of contract %s enabled', VERIFY_CONTRACT_NAME);
  }
}

export const dynamic = 'force-dynamic',
  revalidate = 0,
  fetchCache = 'force-no-store';

export default async function RootLayout({ children }) {
  const defaultContext: ContextData = {
    lang: 'cn',
    user: 'demo.corp_a',
    version: version,
  }
  
  let conn = await ChainProvider.connect();
  await initialChainEnvironment(conn);
  
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
