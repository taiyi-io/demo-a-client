import type { NextApiRequest, NextApiResponse } from 'next';
import ChainProvider from '../../../components/chain_provider';
import { VERIFY_CONTRACT_NAME } from '../../../components/verify_asset';
import { RequestRecord, RequestStatus, REQUEST_SCHEMA_NAME, VerifyMode } from '../../../components/verify_request';
import { ResponsePayload } from '../response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //put only
    if ('PUT' === req.method) {
        await handleSubmitRequest(req, res);
    } else {
        throw new Error('unsupport method: ' + req.method);
    }
}

async function handleSubmitRequest(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    interface requestPayload {
        invoker: string,
        bank: string,
        mode: VerifyMode,
    }
    let payload: requestPayload = JSON.parse(req.body);
    const { invoker, bank, mode } = payload;
    let result: ResponsePayload = {
        error_code: 0,
    }
    try {
        if (!invoker) {
            throw new Error('invoker ID required')
        }
        if (!bank) {
            throw new Error('bank ID required')
        }
        if (!mode) {
            throw new Error('mode required')
        }
        await submitRequest(invoker, id as string, bank, mode);
    } catch (error) {
        result.error_code = 500,
            result.message = error.message;
    } finally {
        res.status(200).json(result);
    }
}

async function submitRequest(invoker: string, recordID: string, bank: string, mode: VerifyMode) {
    let conn = await ChainProvider.connect();
    let currentContent = await conn.getDocument(REQUEST_SCHEMA_NAME, recordID);
    let currentRecord: RequestRecord = JSON.parse(currentContent);
    if (RequestStatus.Idle !== currentRecord.status) {
        throw new Error(`record '${recordID}' already submitted`);
    }
    currentRecord.verify_mode = mode;
    currentRecord.status = RequestStatus.Approving;
    currentRecord.invoker = invoker;
    currentRecord.bank = bank;
    currentRecord.invoke_time = new Date().toISOString();
    await conn.updateDocument(REQUEST_SCHEMA_NAME, recordID, JSON.stringify(currentRecord));
    //updated
    console.log(`<API> request '${recordID}' invoked`);
    if (VerifyMode.Contract === mode) {
        const contractName = VERIFY_CONTRACT_NAME;
        await conn.callContract(contractName, [recordID]);
        console.log(`<API> contract ${contractName} automated executed`);
    }
}
