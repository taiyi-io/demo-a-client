import Forms from './request_forms';
import ChainProvider from '../../components/chain_provider';
import { RequestRecord } from '../../components/record';
import { TaiyiClient, DocumentProperty, PropertType } from '../../components/chain_sdk';

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
  await testSchema(conn);
}

async function testSchema(conn: TaiyiClient) {
  const schemaName = 'sample-test111';
  console.log('schema test begin...');
  {
    let result = await conn.hasSchema(schemaName);
    if (result){
      console.log('schema ' + schemaName + ' already exsits');
      await conn.deleteSchema(schemaName);
      console.log('previous schema ' + schemaName + ' deleted');
    }else{
      console.log('schema ' + schemaName + ' not exists')
    }
    console.log('test: check schema ok')
  }
  {
    let properties: DocumentProperty[] = [
      {
        name: 'name',
        type: PropertType.String
      },
      {
        name: 'age',
        type: PropertType.Integer
      },
      {
        name: 'available',
        type: PropertType.Boolean
      }
    ];
    await conn.createSchema(schemaName, properties);
    let current = await conn.getSchema(schemaName);
    console.log('test schema created ok:\n' + JSON.stringify(current))
  }
  {
    let properties: DocumentProperty[] = [
      {
        name: 'name',
        type: PropertType.String
      },
      {
        name: 'age',
        type: PropertType.Integer
      },
      {
        name: 'amount',
        type: PropertType.Currency
      },
      {
        name: 'country',
        type: PropertType.String
      }
    ];
    await conn.updateSchema(schemaName, properties);
    let current = await conn.getSchema(schemaName);
    console.log('test schema updated ok:\n' + JSON.stringify(current))
  }
  {
    await conn.deleteSchema(schemaName);
    console.log('test schema deleted ok: ' + schemaName);
  }
  console.log('schema test complete')
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
