import DetailPanel from './detail_panel';
import ChainProvider from '../../../../components/chain_provider';

const pseudoData = {
  customer: "lisi",
  amount: 1500000,
  bank: 'bank_b',
  minimum_asset: 1000000,
  invoker: 'atom',
  result: false,
  verify_mode: 'manual',
  verifier: 'bob',
  comment: 'The minimum asset does not meet the requirement',
  status: 2,
  create_time: '2022-12-18 11:00:05',
  invoke_time: '2022-12-21 19:41:00',
  verify_time: '2022-12-21 19:43:07'
};


async function getData(id) {
  //todo: parse pagination parameters from query
    // const host = '192.168.25.223';
    const host = '192.168.3.47';
    const port = 9100;
    var conn = await ChainProvider.connect(host, port);
    const status = await conn.getStatus();
  return {
    id: id,
    ...pseudoData,
  };
}


export default async function Page({ params }){
  const formID = params.id;
  const data = await getData(formID);
   return (
    <DetailPanel data={data}/>
   )
}
