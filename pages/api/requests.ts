import type { NextApiRequest, NextApiResponse } from 'next';
import ChainProvider from '../../components/chain_provider';
import { newVerifyRequest, SchemaName } from '../../components/verify_request';
import { ResponsePayload } from './response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //post only
    if ('POST' !== req.method){
        throw new Error('unsupport method: ' + req.method);
    }
    await handleCreateRequest(req, res);
  }

  async function handleCreateRequest(req: NextApiRequest, res: NextApiResponse){
    interface requestPayload{
        customer: string, 
        amount: number, 
        asset: number, 
        creator: string
    }
    let payload: requestPayload = JSON.parse(req.body);
    const { customer, amount, asset, creator } = payload;
    let docID = await createRequest(customer, amount, asset, creator);
    interface dataPayload{
        id: string,
    };
    let data: dataPayload = {
        id: docID
    };
    let result: ResponsePayload = {
        error_code: 0,
        data: data,
    }
    console.log('<API> new request %s created', docID);
    res.status(200).json(result);
  }

  async function createRequest(customer: string, amount: number, asset: number, creator: string): Promise<string> {
    let conn = await ChainProvider.connect();
    let payload = newVerifyRequest(customer, amount, asset, creator);
    const schemaName = SchemaName;
    return conn.addDocument(schemaName, '', JSON.stringify(payload));
  }
