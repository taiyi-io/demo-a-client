import { NewClientFromAccess, TaiyiClient } from "./chain_sdk";
import path from 'path';
import { promises as fs } from 'fs';

const npmPackage = require('../package.json');

export default class ChainProvider{
    static conn: TaiyiClient = null;
    static async connect(): Promise<TaiyiClient> {
        const {host, port} = npmPackage.chain;
        if (null !== this.conn){
            return this.conn;
        }
        const filePath = path.join(process.cwd(), 'access_key.json');
        const content = await fs.readFile(filePath, 'utf8');
        this.conn = NewClientFromAccess(JSON.parse(content));
        await this.conn.connect(host, port);
        return this.conn;
    }
}