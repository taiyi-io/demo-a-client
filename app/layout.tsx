import ChainProvider from '../components/chain_provider';
import { ChainConnector } from '../components/chain_sdk';
import { CONTRACT_DEFINE, VERIFY_CONTRACT_NAME } from '../components/verify_asset';
import { REQUEST_SCHEMA_NAME, SchemaProperties } from '../components/verify_request';
import Boot from './bootstrap';
import npmPackage from '../package.json';

async function initialChainEnvironment(conn: ChainConnector) {
  let hasSchema = await conn.hasSchema(REQUEST_SCHEMA_NAME);
  if (!hasSchema) {
    let defines = SchemaProperties();
    await conn.createSchema(REQUEST_SCHEMA_NAME, defines);
    console.log('schema %s initialized', REQUEST_SCHEMA_NAME);
  }
  if (!await conn.hasContract(VERIFY_CONTRACT_NAME)){
    await conn.deployContract(VERIFY_CONTRACT_NAME, CONTRACT_DEFINE);
    console.log('contract %s deployed', VERIFY_CONTRACT_NAME);      
  }
  if (npmPackage.chain.debug){
    let info = await conn.getContractInfo(VERIFY_CONTRACT_NAME);
    if (!info.trace){
      await conn.enableContractTrace(VERIFY_CONTRACT_NAME);
      console.log('trace flag of contract %s enabled', VERIFY_CONTRACT_NAME);  
    }
  }
}

export const dynamic = 'force-dynamic',
  revalidate = 0,
  fetchCache = 'force-no-store';

export default async function RootLayout({ children }) {  
  let conn = await ChainProvider.connect();
  await initialChainEnvironment(conn);
  
  return (
    <html>
      <body>
        <Boot />
        {children}
      </body>
    </html>
  )
}
