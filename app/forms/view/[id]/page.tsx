import DetailPanel from './panel';
import { getRecord, loadAllRecords } from '../../../../components/chain_utils';

export async function generateStaticParams(){
  const records = await loadAllRecords();
  return records.map(record => ({
    id: record.id,
  }));
}

export default async function Page({ params }){
  const recordID = params.id;
  const data = await getRecord(recordID);
   return (
    <DetailPanel record={data}/>
   )
}
