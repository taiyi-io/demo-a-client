import { getRecord, loadAllRecords, queryBanks } from "../../../../components/chain_utils";
import AutoPanel from "./panel";

// export async function generateStaticParams(){
//   const records = await loadAllRecords();
//   return records.map(record => ({
//     id: record.id,
//   }));
// }

export default async function Page({ params }){
  const recordID = params.id;
  const record = await getRecord(recordID);
  const bankList = await queryBanks();
   return (
    <AutoPanel record={record} bankList={bankList}/>
   )
}
