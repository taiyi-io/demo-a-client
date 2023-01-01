import Link from 'next/link';
import Forms from './request_forms.js';

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
      invoker: 'atom',
      result: true,
      verify_mode: 'manual',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2234',
      customer: "zhangsan",
      amount: 45000,
      bank: 'bank_b',
      invoker: 'atom',
      result: true,
      verify_mode: 'contract',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2235',
      customer: "lisi",
      amount: 1500000,
      bank: 'bank_b',
      invoker: 'atom',
      result: false,
      verify_mode: 'contract',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    },
    {
      id: '2236',
      customer: "laoliu",
      amount: 320000,
      bank: 'bank_b',
      invoker: 'atom',
      result: true,
      verify_mode: 'manual',
      verifier: 'bob',
      status: 2,
      invoke_time: '2022-12-21 17:41:00',
      verify_time: '2022-12-21 18:55:07'
    }
  ]
}

async function getData() {
  //todo: parse pagination parameters from query
  return pseudoData;
}

export default async function Page() {
  const forms = await getData();
  const { offset, size, total, records } = forms;
  return <Forms offset={offset} size={size} total={total} records={records}/>
}
