
import { hexToBin, isHex } from '@bitauth/libauth';
import CryptoJS from 'crypto-js';
import Strings from '@supercharge/strings/dist';
import * as ed25519 from '@noble/ed25519';

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


export function NewClientFromAccess(data) {
    const { id, encode_method, private_key } = data.private_data;
    if (defaultKeyEncodeMethod === encode_method) {
        if (!isHex(private_key)) {
            throw new Error('invalid key format');
        }
        var decoded = hexToBin(private_key).slice(0, 32);
        return NewClient(id, decoded);
    } else {
        throw new Error('unsupport encode method: ' + encode_method);
    }
}

export function NewClient(accessID, privateKey) {
    return new TaiyiClient(accessID, privateKey);
}

export class TaiyiClient {
    #_accessID = '';
    #_privateKey = [];
    #_apiBase = '';
    #_domain = '';
    #_nonce = '';
    #_sessionID = '';
    #_timeout = 0;
    #_localIP = '';
    constructor(accessID, privateKey) {
        this.#_accessID = accessID;
        this.#_privateKey = privateKey;
        this.#_apiBase = '';
        this.#_domain = '';
        this.#_nonce = '';
        this.#_sessionID = '';
        this.#_timeout = 0;
        this.#_localIP = '';
    }

    getVersion() {
        return SDKVersion;
    }

    async connect(host, port) {
        return this.connectToDomain(host, port, defaultDomainName);
    }

    async connectToDomain(host, port, domainName) {
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
        var headers = {};
        headers[headerNameTimestamp] = timestamp;
        headers[headerNameSignatureAlgorithm] = signagureAlgorithm;
        headers[headerNameSignature] = signature;
        const { session, timeout, address } = await this.#rawRequest('post', '/sessions/', headers, requestData);
        this.#_sessionID = session;
        this.#_timeout = timeout;
        this.#_localIP = address;
        // process.stdout.write('session allocated: ' + this.#_sessionID + '\n');
        return;
    }

    async activate() {
        const url = this.#mapToAPI('/sessions/');
        return this.#doRequest(('put', url));
    }

    /**
     * Get Current Chain Status
     * 
     * @returns {
     *  world_version,
     *  block_height,
     *  previous_block,
     *  genesis_block,
     *  allocated_transaction_id,
     * } return status object
     * 
     */
    async getStatus() {
        const url = this.#mapToDomain('/status');
        return this.#fetchResponse('get', url);
    }

    /**
     * Return list of current schemas
     * 
     * @param {int} queryStart start offset when querying
     * @param {int} maxRecord max records could returne
     * @returns {
     *  schemas,
     *  limit,
     *  offset,
     *  total
     * }
     */
    async querySchemas(queryStart, maxRecord) {
        const url = this.#mapToDomain('/schemas/');
        const condition = {
            offset: queryStart,
            limit: maxRecord,
        }
        return this.#fetchResponseWithPayload('post', url, condition);
    }

    #newNonce() {
        const nonceLength = 16;
        return Strings.random(nonceLength);
    }

    async #base64Signature(obj) {
        const content = Buffer.from(JSON.stringify(obj), 'utf-8');
        const signed = await ed25519.sign(content, this.#_privateKey);
        return Buffer.from(signed).toString(signatureEncode);
    }

    async #rawRequest(method, path, headers, payload) {
        const url = this.#mapToAPI(path);
        headers[headerContentType] = contentTypeJSON;
        var options = {
            method: method,
            headers: headers,
        }
        if (payload) {
            options.body = JSON.stringify(payload);
        }
        return this.#getResult(url, options);
    }

    async #peekRequest(method, url) {
        var request = this.#prepareOptions(method, url, null);
        var resp = await fetch(request);
        return resp.ok;
    }

    async #validateResult(request) {
        this.#parseResponse(request);
    }

    async #parseResponse(url, options) {
        var resp = await fetch(url, options);
        if (!resp.ok) {
            throw new Error('fetch result failed with status ' + resp.status + ': ' + resp.statusText);
        }
        var payload = await resp.json();
        if (0 != payload[payloadPathErrorCode]) {
            throw new Error('fetch failed: ' + payload[payloadPathErrorMessage]);
        }
        return payload;
    }

    async #getResult(url, options) {
        var payload = await this.#parseResponse(url, options);
        return payload[payloadPathData];
    }

    async #doRequest(method, url) {
        var options = await this.#prepareOptions(method, url, null);
        return this.#validateResult(url, options);
    }

    async #doRequestWithPayload(method, url, payload) {
        var options = await this.#prepareOptions(method, url, payload);
        return this.#validateResult(url, options);
    }

    async #fetchResponse(method, url) {
        var options = await this.#prepareOptions(method, url, null);
        return this.#getResult(url, options)
    }

    async #fetchResponseWithPayload(method, url, payload) {
        var options = await this.#prepareOptions(method, url, payload);
        return this.#getResult(url, options)
    }

    async #prepareOptions(method, url, payload) {
        const urlObject = new URL(url);
        const now = new Date();
        const timestamp = now.toISOString();
        var signatureContent = {
            id: this.#_sessionID,
            method: method.toUpperCase(),
            url: urlObject.pathname,
            body: '',
            access: this.#_accessID,
            timestamp: timestamp,
            nonce: this.#_nonce,
            signature_algorithm: signatureMethodEd25519,
        }
        var options = {
            method: method
        };
        var headers = {};
        let bodyContent = '';
        if (payload) {
            headers[headerContentType] = contentTypeJSON;
            bodyContent = JSON.stringify(payload);
            options.body = bodyContent;
        }
        var request = new Request(url, options);
        if ('post' === method || 'put' === method || 'delete' === method || 'patch' === method) {
            var hash = CryptoJS.SHA256(bodyContent);
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

    #mapToAPI(path) {
        return this.#_apiBase + path;
    }

    #mapToDomain(path) {
        return this.#_apiBase + '/domains/' + this.#_domain + path;
    }
}