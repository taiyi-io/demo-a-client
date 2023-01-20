import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    //post only
    if ('POST' !== req.method){
        throw new Error('unsupport method: ' + req.method);
    }
  }

  function createRequest(customer: string, amount: number, asset: number){
    
  }
