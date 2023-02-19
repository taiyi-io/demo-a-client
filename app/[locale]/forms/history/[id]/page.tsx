import HistoryPanel from './panel';
import { getRecordHistory } from '../../../../../components/chain_utils';


export default async function Page({ params }){
  const recordID: string = params.id;
  let history = await getRecordHistory(recordID);
   return (
    <HistoryPanel history={history}/>
   )
}
