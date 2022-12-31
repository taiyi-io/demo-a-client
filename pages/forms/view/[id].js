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


export async function getServerSideProps({params}) {
  //todo: parse pagination parameters from query
  const { id } = params;
  return {
    props: {
      id: id,
      ...pseudoData,
    }, // will be passed to the page component as props
  }
}

export default function Detail(data){
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
