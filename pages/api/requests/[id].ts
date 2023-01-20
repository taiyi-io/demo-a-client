import type { NextApiRequest, NextApiResponse } from 'next';
import { VerifyMode } from '../../../components/verify_request';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    //put only
    if ('PUT' !== req.method){
        throw new Error('unsupport method: ' + req.method);
    }
  }

  function submitRequest(bank: string, mode: VerifyMode){

  }
