import Submit from './submit';

const pseudoData = {
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
};

async function getData(id) {
  //todo: parse pagination parameters from query
  return {
    id: id,
    ...pseudoData,
  };
}

async function queryBanks(){
  return [
    'bank_b',
  ];
}


export default async function Page({ params }){
  const formID = params.id;
  const data = await getData(formID);
  const bankList = await queryBanks();
   return (
     <div className='container'>
      <div className='row p-3'>
        <div className='col-3'>          
        </div>
        <div className='col-6'>
          <Submit data={data} bankList={bankList}/>
        </div>
      </div>
     </div>
   )
}
