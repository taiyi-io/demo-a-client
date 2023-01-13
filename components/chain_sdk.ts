
import { hexToBin, isHex } from '@bitauth/libauth';
import CryptoJS from 'crypto-js';
import Strings from '@supercharge/strings/dist';
import * as ed25519 from '@noble/ed25519';
import exp from 'constants';

const SDKVersion = '0.1.0';
const APIVersion = '1';
// const projectName = 'Taiyi';
const projectName = 'Paimon';
const headerNameSession = projectName + '-Session';
const headerNameTimestamp = projectName + '-Timestamp';
const headerNameSignature = projectName + '-Signature';
const headerNameSignatureAlgorithm = projectName + '-SignatureAlgorithm';
const defaultDomainName = 'system';
const defaultDomainHost = "localhost";

const signatureEncode = 'base64';
const signatureMethodEd25519 = "ed25519";
const headerContentType = "Content-Type";
const contentTypeJSON = "application/json";
const payloadPathErrorCode = "error_code";
const payloadPathErrorMessage = "message";
const payloadPathData = "data";
const keyEncodeMethodEd25519Hex = "ed25519-hex";
const defaultKeyEncodeMethod = keyEncodeMethodEd25519Hex;

export enum PropertType {
    String = "string",
    Boolean = "bool",
    Integer = "int",
    Float = "float",
    Currency = "currency",
    Collection = "collection",
    Document = "document",
}

enum RequestMethod{
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
}

export interface AccessKey {
    private_data: {
        version: number,
        id: string,
        encode_method: RequestMethod,
        private_key: string,
    }
}

export interface ChainStatus {
    world_version: string,
    block_height: number,
    previous_block: string,
    genesis_block: string,
    allocated_transaction_id: string,
}

export interface SchemaRecords {
    schemas: string[],
    limit: number,
    offset: number,
    total: number,
}

export interface DocumentProperty {
    name: string,
    type: PropertType,
    indexed?: boolean,
}

export interface DocumentSchema {
    name: string,
    properties?: DocumentProperty[],
}

export interface Document {
    id: string,
    content: string
}

export enum FilterOperator {
    Equal = 0,
    NotEqual,
    GreaterThan,
    LesserThan,
    GreaterOrEqual,
    LesserOrEqual
}

export interface ConditionFilter {
    property: string,
    operator: FilterOperator,
    value: string
}

export interface TraceLog {
    version: number,
    timestamp: string,
    operate: string,
    invoker: string,
    block?: string,
    transaction?: string,
    confirmed: boolean
}

export interface ContractStep {
    action: string,
    params?: string[],
}

export interface BlockData {
    id: string,
    timestamp: string,
    previous_block: string,
    height: number,
    transactions: number,
    content: string,
}

export interface TransactionData{
    block: string,
    transaction: string,
    timestamp: string,
    validated: boolean,
    content: string,
}

export interface ContractDefine{
    steps: ContractStep[],
}

export interface LogRecord {
    latest_version: number,
    logs?: TraceLog,
}


interface requestOptions {
    method: RequestMethod,
    body?: string,
    headers?: object,
}

interface sessionResponse {
    session: string,
    timeout: number,
    address: string,
}

export function NewClientFromAccess(key: AccessKey) {
    const { id, encode_method, private_key } = key.private_data;
    if (defaultKeyEncodeMethod === encode_method) {
        if (!isHex(private_key)) {
            throw new Error('invalid key format');
        }
        let decoded = hexToBin(private_key).slice(0, 32);
        return NewClient(id, decoded);
    } else {
        throw new Error('unsupport encode method: ' + encode_method);
    }
}

export function NewClient(accessID: string, privateKey: Uint8Array) {
    return new TaiyiClient(accessID, privateKey);
}

export class TaiyiClient {
    #_accessID: string = '';
    #_privateKey: Uint8Array;
    #_apiBase: string = '';
    #_domain: string = '';
    #_nonce: string = '';
    #_sessionID: string = '';
    #_timeout: number = 0;
    #_localIP: string = '';
    constructor(accessID: string, privateKey: Uint8Array) {
        this.#_accessID = accessID;
        this.#_privateKey = privateKey;
        this.#_apiBase = '';
        this.#_domain = '';
        this.#_nonce = '';
        this.#_sessionID = '';
        this.#_timeout = 0;
        this.#_localIP = '';
    }

    get Version() {
        return SDKVersion;
    }

    get SessionID() {
        return this.#_sessionID;
    }

    get AccessID() {
        return this.#_accessID;
    }

    get LocalIP() {
        return this.#_localIP;
    }

    async connect(host: string, port: number) {
        return this.connectToDomain(host, port, defaultDomainName);
    }

    async connectToDomain(host: string, port: number, domainName: string) {
        if ('' === host) {
            host = defaultDomainHost;
        }
        if ('' === domainName) {
            throw new Error('domain name omit');
        }
        if (port <= 0 || port > 0xFFFF) {
            throw new Error('invalid port ' + port);
        }
        this.#_apiBase = 'http://' + host + ':' + port + '/api/v' + APIVersion;
        this.#_domain = domainName;
        this.#_nonce = this.#newNonce();
        const now = new Date();
        const timestamp = now.toISOString();
        const signagureAlgorithm = signatureMethodEd25519;
        const signatureContent = {
            access: this.#_accessID,
            timestamp: timestamp,
            nonce: this.#_nonce,
            signature_algorithm: signagureAlgorithm,
        };
        const signature = await this.#base64Signature(signatureContent);
        const requestData = {
            id: this.#_accessID,
            nonce: this.#_nonce,
        };
        let headers = {};
        headers[headerNameTimestamp] = timestamp;
        headers[headerNameSignatureAlgorithm] = signagureAlgorithm;
        headers[headerNameSignature] = signature;
        let resp = await this.#rawRequest(RequestMethod.POST, '/sessions/', headers, requestData);
        const { session, timeout, address } = (resp as sessionResponse);
        this.#_sessionID = session;
        this.#_timeout = timeout;
        this.#_localIP = address;
        // process.stdout.write('session allocated: ' + this.#_sessionID + '\n');
        return;
    }

    async activate() {
        const url = this.#mapToAPI('/sessions/');
        return this.#doRequest(RequestMethod.PUT, url);
    }

    /**
     * Get Current Chain Status
     * 
     * @returns {Promise<ChainStatus>} return status object
     * 
     */
    async getStatus(): Promise<ChainStatus> {
        const url = this.#mapToDomain('/status');
        return this.#fetchResponse('get', url) as Promise<ChainStatus>;
    }

    /**
     * Return list of current schemas
     * 
     * @param {int} queryStart start offset when querying
     * @param {int} maxRecord max records could returne
     * @returns {Promise<SchemaRecords>} return records
     */
    async querySchemas(queryStart: number, maxRecord: number): Promise<SchemaRecords> {
        const url = this.#mapToDomain('/schemas/');
        const condition = {
            offset: queryStart,
            limit: maxRecord,
        }
        return this.#fetchResponseWithPayload(RequestMethod.POST, url, condition) as Promise<SchemaRecords>;
    }

    /**
     * Rebuild index of a schema
     * @param schemaName schema for rebuilding
     */
    async rebuildIndex(schemaName: string) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain('/schemas/' + schemaName + '/index/');
        this.#doRequest(RequestMethod.POST, url);
    }

    /**
     * Create a new schema
     * @param schemaName Name of new schema
     * @param properties Properties of new schema
     */
    async createSchema(schemaName: string, properties: DocumentProperty[]) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        this.#doRequestWithPayload(RequestMethod.POST, url, properties);
    }

    async updateSchema(schemaName: string, properties: DocumentProperty[]) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        this.#doRequestWithPayload(RequestMethod.PUT, url, properties);
    }
    
    async deleteSchema(schemaName: string) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        this.#doRequest(RequestMethod.DELETE, url);
    }
    
    async hasSchema(schemaName: string): Promise<boolean> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        return this.#peekRequest(RequestMethod.HEAD, url);
    }
    
    async getSchema(schemaName: string): Promise<DocumentSchema> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<DocumentSchema>);
    }

    #newNonce(): string {
        const nonceLength = 16;
        return Strings.random(nonceLength);
    }

    async #base64Signature(obj: object): Promise<string> {
        const content = Buffer.from(JSON.stringify(obj), 'utf-8');
        const signed = await ed25519.sign(content, this.#_privateKey);
        return Buffer.from(signed).toString(signatureEncode);
    }

    async #rawRequest(method: RequestMethod, path: string, headers: object, payload: object): Promise<object> {
        const url = this.#mapToAPI(path);
        headers[headerContentType] = contentTypeJSON;
        let options: requestOptions = {
            method: method,
            headers: headers,
        }
        if (payload) {
            options.body = JSON.stringify(payload);
        }
        return this.#getResult(url, options);
    }

    async #peekRequest(method: RequestMethod, url: string): Promise<boolean> {
        let options = await this.#prepareOptions(method, url, null);
        let resp = await fetch(url, options);
        return resp.ok;
    }

    async #validateResult(url: string, options: object) {
        this.#parseResponse(url, options);
    }

    async #parseResponse(url: string, options: object): Promise<object> {
        let resp = await fetch(url, options);
        if (!resp.ok) {
            throw new Error('fetch result failed with status ' + resp.status + ': ' + resp.statusText);
        }
        let payload = await resp.json();
        if (0 != payload[payloadPathErrorCode]) {
            throw new Error('fetch failed: ' + payload[payloadPathErrorMessage]);
        }
        return payload;
    }

    async #getResult(url: string, options: object): Promise<object> {
        let payload = await this.#parseResponse(url, options);
        return payload[payloadPathData];
    }

    async #doRequest(method: RequestMethod, url: string) {
        let options = await this.#prepareOptions(method, url, null);
        this.#validateResult(url, options);
    }

    async #doRequestWithPayload(method: RequestMethod, url: string, payload: object) {
        let options = await this.#prepareOptions(method, url, payload);
        this.#validateResult(url, options);
    }

    async #fetchResponse(method: RequestMethod, url: string): Promise<object> {
        let options = await this.#prepareOptions(method, url, null);
        return this.#getResult(url, options)
    }

    async #fetchResponseWithPayload(method: RequestMethod, url: string, payload: object): Promise<object> {
        let options = await this.#prepareOptions(method, url, payload);
        return this.#getResult(url, options)
    }

    async #prepareOptions(method: RequestMethod, url: string, payload: object): Promise<object> {
        const urlObject = new URL(url);
        const now = new Date();
        const timestamp = now.toISOString();
        let signatureContent = {
            id: this.#_sessionID,
            method: method.toUpperCase(),
            url: urlObject.pathname,
            body: '',
            access: this.#_accessID,
            timestamp: timestamp,
            nonce: this.#_nonce,
            signature_algorithm: signatureMethodEd25519,
        }
        let options: requestOptions = {
            method: method
        };
        let headers = {};
        let bodyContent = '';
        if (payload) {
            headers[headerContentType] = contentTypeJSON;
            bodyContent = JSON.stringify(payload);
            options.body = bodyContent;
        }
        if (RequestMethod.POST === method || RequestMethod.PUT === method || RequestMethod.DELETE === method 
            || RequestMethod.PATCH === method) {
            let hash = CryptoJS.SHA256(bodyContent);
            signatureContent.body = CryptoJS.enc.Base64.stringify(hash);
        }
        const signature = await this.#base64Signature(signatureContent);
        headers[headerNameSession] = this.#_sessionID;
        headers[headerNameTimestamp] = timestamp;
        headers[headerNameSignatureAlgorithm] = signatureMethodEd25519;
        headers[headerNameSignature] = signature;
        options.headers = headers;
        // process.stdout.write('session: ' + this.#_sessionID + '\n');
        // process.stdout.write('signature: ' + signature + '\n');
        // process.stdout.write('content: ' + JSON.stringify(signatureContent) + '\n');
        return options;
    }

    #mapToAPI(path: string): string {
        return this.#_apiBase + path;
    }

    #mapToDomain(path: string): string {
        return this.#_apiBase + '/domains/' + this.#_domain + path;
    }
}