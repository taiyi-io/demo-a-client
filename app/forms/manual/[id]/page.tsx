import { getRecord, loadAllRecords, queryBanks } from "../../../../components/chain_utils";
import ManualPanel from "./panel";

export async function generateStaticParams(){
  const records = await loadAllRecords();
  return records.map(record => ({
    id: record.id,
  }));
}

export default async function Page({
  params,
}: {
  params: { id: string },
}) {
  const recordID = params.id;
  const record = await getRecord(recordID);
  const bankList = await queryBanks();
  return (
    <ManualPanel record={record} bankList={bankList} />
  )
}
