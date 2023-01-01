import Link from 'next/link';

const pseudoData = {
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
};


async function getData(id) {
  //todo: parse pagination parameters from query
  return {
    id: id,
    ...pseudoData,
  };
}


export default async function Page({ params }){
  const formID = params.id;
  const data = await getData(formID);
  const {id, customer, amount, bank, verify_mode, result,
   status, invoke_time, verify_time} = data;
   return (
     <div>
      <Link href='/forms'>Back</Link>
      <div>ID: {id}</div>
      <div>Customer: {customer}</div>
      <div>Amount: {amount}</div>
      <div>Bank: {bank}</div>
      <div>Verify_mode: {verify_mode}</div>
     </div>
   )
}
