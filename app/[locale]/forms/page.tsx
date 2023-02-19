import Forms from './request_forms';
import ChainProvider from '../../../components/chain_provider';
import { QueryBuilder } from '../../../components/chain_sdk';
import { REQUEST_SCHEMA_NAME, RequestRecord } from '../../../components/verify_request';
import { RecordList } from '../../../components/verify_request';

async function queryRecords(pageOffset: number, pageSize: number): Promise<RecordList> {
  let conn = await ChainProvider.connect();
  let condition = new QueryBuilder().
    MaxRecord(pageSize).
    SetOffset(pageOffset).
    DescendBy('create_time').
    Build();
  let result = await conn.queryDocuments(REQUEST_SCHEMA_NAME, condition);
  let recordList: RecordList = {
    records: [],
    offset: result.offset,
    size: result.limit,
    total: result.total,
  };
  if (result.documents && 0 !== result.documents.length){
    for (let doc of result.documents){
      let record: RequestRecord = JSON.parse(doc.content);
      record.id = doc.id;
      recordList.records.push(record);
    }
  }
  return recordList;
}

export default async function Page({ searchParams }: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let page: number = 0;
  if (searchParams.page){
    let pageString = searchParams.page as string;
    let index = Number.parseInt(pageString);
    if (!Number.isNaN(index)){
      page = index;
    }
  }
  const pageSize = 5;
  const offset = pageSize * page;
  let records = await queryRecords(offset, pageSize);
  return <Forms requests={records} />;
}
