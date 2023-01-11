import Forms from './request_forms.js';
import path from 'path';
import { NewClientFromAccess } from '../chain_sdk.js';
import { promises as fs } from 'fs';

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

async function getData() {
  //todo: parse pagination parameters from query
  const filePath = path.join(process.cwd(), 'access_key.json');
  const content = await fs.readFile(filePath, 'utf8');
  const sdk = NewClientFromAccess(JSON.parse(content));
  const host = '192.168.25.223';
  const port = 9100;
  await sdk.connect(host, port);
  const status = await sdk.getStatus();
  const schemas = await sdk.querySchemas(0, 10);
  return pseudoData;
}

export default async function Page() {
  const forms = await getData();
  const { offset, size, total, records } = forms;
  return <Forms offset={offset} size={size} total={total} records={records}/>
}
