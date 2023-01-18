import Forms from './request_forms';
import ChainProvider from '../../components/chain_provider';
import { RequestRecord } from '../../components/record';
import { TaiyiClient } from '../../components/chain_sdk';

interface RecordList {
  offset: number,
  size: number,
  total: number,
  records: RequestRecord[]
}

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

async function doTest(conn: TaiyiClient) {
  const status = await conn.getStatus();
  console.log('status: ' + JSON.stringify(status) + '\n');
  const schemas = await conn.querySchemas(0, 10);
  console.log('schemas: ' + JSON.stringify(schemas));
}

async function getData(): Promise<RecordList> {
  //todo: parse pagination parameters from query
  var conn = await ChainProvider.connect();
  await doTest(conn);
  return pseudoData;
}

export default async function Page() {
  const forms = await getData();
  const { offset, size, total, records } = forms;
  return <Forms offset={offset} size={size} total={total} records={records} />;
}
