import ChainProvider from "./chain_provider";
import { LogRecords, QueryBuilder } from "@taiyi-io/chain-connector";
import { ASSET_SCHEMA_NAME } from "./verify_asset";
import { RequestRecord, REQUEST_SCHEMA_NAME } from "./verify_request";

export async function getRecord(recordID: string): Promise<RequestRecord> {
  let conn = await ChainProvider.connect();
  let content = await conn.getDocument(REQUEST_SCHEMA_NAME, recordID);
  let record: RequestRecord = JSON.parse(content);
  record.id = recordID;
  return record;
}

export async function queryBanks():  Promise<string[]> {
  return [
    'bank_b',
  ];
}

export async function queryCustomers():  Promise<string[]> {
  const pageSize = 20;
  const schemaName = ASSET_SCHEMA_NAME;
  let offset = 0;
  let result: string[] = [];
  let exitFlag = false;
  let conn = await ChainProvider.connect();
  do {
    let condition = new QueryBuilder().
      MaxRecord(pageSize).
      SetOffset(offset).
      Build();
    let records = await conn.queryDocuments(schemaName, condition);
    if (records.documents && 0 !== records.documents.length) {
      for (let doc of records.documents) {
        offset++;
        result.push(doc.id);
      }
    }
    if (offset >= records.total) {
      exitFlag = true;
    }
  } while (!exitFlag);
  return result;
}

export async function loadAllRecords(): Promise<RequestRecord[]>{  
  const pageSize = 20;
  const schemaName = REQUEST_SCHEMA_NAME;
  let offset = 0;
  let result: RequestRecord[] = [];
  let exitFlag = false;
  let conn = await ChainProvider.connect();
  do {
    let condition = new QueryBuilder().MaxRecord(pageSize).SetOffset(offset).Build();
    let records = await conn.queryDocuments(schemaName, condition);
    if (records.documents && 0 !== records.documents.length){
      for (let doc of records.documents){
        let record: RequestRecord = JSON.parse(doc.content);
        record.id = doc.id;
        offset++;
        result.push(record);
      }      
    }
    if(offset >= records.total){
      exitFlag = true;
    }
  }while(!exitFlag);
  return result;
}

export async function getRecordHistory(recordID: string): Promise<LogRecords>{  
  const schemaName = REQUEST_SCHEMA_NAME;
  let conn = await ChainProvider.connect();
  return conn.getDocumentLogs(schemaName, recordID);
}