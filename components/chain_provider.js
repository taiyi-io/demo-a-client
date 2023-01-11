import { NewClientFromAccess } from "./chain_sdk";
import path from 'path';
import { promises as fs } from 'fs';

export default class ChainProvider{
    static conn = null;
    static async connect(host, port){
        // process.stdout.write('call connect, current conn: ' + this.conn)
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