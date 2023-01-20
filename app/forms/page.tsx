import Forms from './request_forms';
import ChainProvider from '../../components/chain_provider';
import { QueryBuilder, TaiyiClient } from '../../components/chain_sdk';
import { SchemaName, SchemaProperties, RequestRecord } from '../../components/verify_request';
import { RecordList } from './request_forms';

const pseudoData = {
  offset: 1,
  size: 20,
  total: 130,
  records: [
    {
      id: '1234',
      customer: "wang_xiaoer",
      amount: 500000,
      bank: 'bank_b',
      minimum_asset: 300000,
      invoker: 'atom',
      result: true,
      verify_mode: 'manual',
      verifier: 'bob',
      status: 0,
      create_time: '2022-12-20 10:00:05',
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2234',
      customer: "zhangsan",
      amount: 45000,
      bank: 'bank_b',
      minimum_asset: 30000,
      invoker: 'atom',
      result: true,
      verify_mode: 'contract',
      verifier: 'bob',
      status: 2,
      create_time: '2022-12-19 09:00:05',
      invoke_time: '2022-12-21 18:41:00',
      verify_time: '2022-12-21 21:55:07'
    },
    {
      id: '2235',
      customer: "lisi",
      amount: 1500000,
      bank: 'bank_b',
      minimum_asset: 1000000,
      invoker: 'atom',
      result: false,
      verify_mode: 'contract',
      verifier: 'bob',
      status: 2,
      create_time: '2022-12-18 11:00:05',
      invoke_time: '2022-12-21 19:41:00',
      verify_time: '2022-12-21 19:43:07'
    },
    {
      id: '2236',
      customer: "laoliu",
      amount: 320000,
      bank: 'bank_b',
      minimum_asset: 250000,
      invoker: 'atom',
      result: true,
      verify_mode: 'manual',
      verifier: 'bob',
      status: 1,
      create_time: '2022-12-19 11:20:05',
      invoke_time: '2022-12-21 21:30:00',
      verify_time: '2022-12-22 10:55:07'
    }
  ]
}

async function ensureSchema(conn: TaiyiClient) {
  let hasSchema = await conn.hasSchema(SchemaName);
  if (!hasSchema) {
    let defines = SchemaProperties();
    await conn.createSchema(SchemaName, defines);
    console.log('schema %s initialized', SchemaName);
  }
}

async function queryRecords(conn: TaiyiClient, pageOffset: number, pageSize: number): Promise<RecordList> {
  let condition = new QueryBuilder().
    MaxRecord(pageSize).
    SetOffset(pageOffset).
    DescendBy('create_time').
    Build();
  let result = await conn.queryDocuments(SchemaName, condition);
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
  let page = 0;
  const pageSize = 10;
  const offset = pageSize * page;
  let conn = await ChainProvider.connect();
  await ensureSchema(conn);
  let records = await queryRecords(conn, offset, pageSize);
  return <Forms requests={records} />;
}
