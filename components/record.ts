export interface RequestRecord {
    id: string,
    customer: string,
    amount: number,
    bank: string,
    minimum_asset: number,
    invoker: string,
    result: boolean,
    verify_mode: string,
    verifier: string,
    status: number,
    create_time: string,
    invoke_time: string,
    verify_time: string
}