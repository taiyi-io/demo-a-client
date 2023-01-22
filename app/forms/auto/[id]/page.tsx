import { queryBanks } from "../../manual/[id]/page";
import { getRecord } from "../../view/[id]/page";
import AutoPanel from "./panel";

export default async function Page({ params }){
  const recordID = params.id;
  const record = await getRecord(recordID);
  const bankList = await queryBanks();
   return (
    <AutoPanel record={record} bankList={bankList}/>
   )
}
