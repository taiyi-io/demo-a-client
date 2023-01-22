import { getRecord } from "../../view/[id]/page";
import ManualPanel from "./panel";

export async function queryBanks(){
  return [
    'bank_b',
  ];
}

export default async function Page({ params }){
  const recordID = params.id;
  const record = await getRecord(recordID);
  const bankList = await queryBanks();
   return (
    <ManualPanel record={record} bankList={bankList}/>
   )
}
