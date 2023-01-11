import { NewClientFromAccess, TaiyiClient } from "./chain_sdk";
import path from 'path';
import { promises as fs } from 'fs';

export default class ChainProvider{
    static conn: TaiyiClient = null;
    static async connect(host: string, port: number): Promise<TaiyiClient> {
        
        if (null !== this.conn){
            return this.conn;
        }
        const filePath = path.join(process.cwd(), 'access_key.json');
        const content = await fs.readFile(filePath, 'utf8');
        this.conn = NewClientFromAccess(JSON.parse(content));
        process.stdout.write('allocate conn: ' + this.conn)
        await this.conn.connect(host, port);
        return this.conn;
    }
}