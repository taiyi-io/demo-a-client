import DetailPanel from './panel';
import { getRecord } from '../../../../../components/chain_utils';

export default async function Page({ params }) {
  const recordID = params.id;
  const data = await getRecord(recordID);
  return (
    <DetailPanel record={data} />
  )
}
