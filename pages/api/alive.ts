import { NextApiRequest, NextApiResponse } from "next";
import ChainProvider from "../../components/chain_provider";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if ('PUT' === req.method ){
        await handleKeepAlive(req, res);
    }else{
        throw new Error('unsupport method: ' + req.method);
    }
}

async function handleKeepAlive(req: NextApiRequest, res: NextApiResponse){
    let conn = await ChainProvider.connect();
    await conn.activate();
    console.log("<API> keep session alive");
    res.status(200).end();
}