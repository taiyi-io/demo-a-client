import FormDetail from './detail';
import BackButton from '../../../../components/back_button';

const pseudoData = {
  customer: "lisi",
  amount: 1500000,
  bank: 'bank_b',
  minimum_asset: 1000000,
  invoker: 'atom',
  result: false,
  verify_mode: 'contract',
  verifier: 'bob',
  comment: 'The minimum asset does not meet the requirement',
  status: 2,
  create_time: '2022-12-18 11:00:05',
  invoke_time: '2022-12-21 19:41:00',
  verify_time: '2022-12-21 19:43:07'
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
   return (
     <div className='container'>
      <div className='row p-3'>
        <div className='col-3'>          
        </div>
        <div className='col-6'>
          <FormDetail data={data}/>
        </div>
      </div>
      <div className='row justify-content-center'>
        <div className='col-2'>
          <BackButton href='/forms'/>
        </div>
      </div>
     </div>
   )
}
