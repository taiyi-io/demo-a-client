import DetailPanel from './panel';
import ChainProvider from '../../../../components/chain_provider';
import { RequestRecord, REQUEST_SCHEMA_NAME } from '../../../../components/verify_request';

export async function getRecord(recordID: string): Promise<RequestRecord>{
  let conn = await ChainProvider.connect();
  let content = await conn.getDocument(REQUEST_SCHEMA_NAME, recordID);
  let record: RequestRecord = JSON.parse(content);
  record.id = recordID;
  return record;
}

export default async function Page({ params }){
  const recordID = params.id;
  const data = await getRecord(recordID);
   return (
    <DetailPanel record={data}/>
   )
}
