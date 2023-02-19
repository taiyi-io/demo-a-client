import { DocumentProperty, PropertyType } from "@taiyi-io/chain-connector";

enum RequestParameter {
    Customer = 'customer',
    Amount = 'amount',
    Bank = 'bank',
    Creator = 'creator',
    Asset = 'minimum_asset',
    Invoker = 'invoker',
    Result = 'result',
    Mode = 'verify_mode',
    Verifier = 'verifier',
    Comment = 'comment',
    Status = 'status',
    CreateTime = 'create_time',
    InvokeTime = 'invoke_time',
    VerifyTime = 'verify_time',
};

export enum VerifyMode {
    Unknown = '',
    Manual = 'manual',
    Contract = 'contract',
}

export enum RequestStatus {
    Idle = 0,
    Approving,
    Complete,
}

export interface RequestRecord {
    id?: string,
    customer: string,
    amount: number,
    minimum_asset: number,
    creator: string,
    create_time: string,
    status: RequestStatus,
    bank?: string,
    invoker?: string,
    invoke_time?: string,
    verify_mode: VerifyMode,
    result?: boolean,
    verifier?: string,
    verify_time?: string,
    comment?: string,
};

export interface RecordList {
    offset: number,
    size: number,
    total: number,
    records: RequestRecord[],
  }

export const REQUEST_SCHEMA_NAME = 'verify_request';

export function SchemaProperties(): DocumentProperty[] {
    return [
        {
            name: RequestParameter.Customer,
            type: PropertyType.String,
        },
        {
            name: RequestParameter.Amount,
            type: PropertyType.Currency,
        },
        {
            name: RequestParameter.Asset,
            type: PropertyType.Currency,
        },
        {
            name: RequestParameter.Creator,
            type: PropertyType.String,
        },
        {
            name: RequestParameter.CreateTime,
            type: PropertyType.String,
            indexed: true,
        },
        {
            name: RequestParameter.Status,
            type: PropertyType.Integer,
            indexed: true,
        },
        {
            name: RequestParameter.Bank,
            type: PropertyType.String,
            omissible: true,
        },
        {
            name: RequestParameter.Invoker,
            type: PropertyType.String,
            omissible: true,
        },
        {
            name: RequestParameter.InvokeTime,
            type: PropertyType.String,
            omissible: true,
        },
        {
            name: RequestParameter.Mode,
            type: PropertyType.String,
            indexed: true,
        },
        {
            name: RequestParameter.Result,
            type: PropertyType.Boolean,
            indexed: true,
        },
        {
            name: RequestParameter.Verifier,
            type: PropertyType.String,
            omissible: true,
        },
        {
            name: RequestParameter.VerifyTime,
            type: PropertyType.String,
            omissible: true,
        },
        {
            name: RequestParameter.Comment,
            type: PropertyType.String,
            omissible: true,
        }
    ];
};

export function newVerifyRequest(customer: string, amount: number, asset: number, creator: string): VerifyRequest {
    const now = new Date();
    const timestamp = now.toISOString();
    const input = {
        customer: customer,
        amount: amount,
        minimum_asset: asset,
        creator: creator,
        create_time: timestamp,
        status: RequestStatus.Idle,
        verify_mode: VerifyMode.Unknown,
    }
    return new VerifyRequest(input);
}

export class VerifyRequest {
    id: string = '';
    customer: string = '';
    amount: number;
    minimum_asset: number;
    creator: string;
    create_time: string;
    status: RequestStatus;
    bank: string = '';
    invoker: string = '';
    invoke_time: string = '';
    verify_mode: VerifyMode;
    result: boolean = false;
    verifier: string = '';
    verify_time: string = '';
    comment: string = '';
    constructor(input: RequestRecord) {
        const { customer, amount, minimum_asset, creator, create_time, status, bank, invoker, invoke_time, verify_mode,
            result, verifier, verify_time, comment, id } = input;
        this.customer = customer;
        this.amount = amount;
        this.minimum_asset = minimum_asset;
        this.creator = creator;
        this.create_time = create_time;
        this.verify_mode = verify_mode;
        this.status = status;
        if (!result){
            this.result = false;
        }else{
            this.result = true;
        }
        if (id) {
            this.id = id;
        }
        if (bank) {
            this.bank = bank;
        }
        if (invoker) {
            this.invoker = invoker;
        }
        if (invoke_time) {
            this.invoke_time = invoke_time;
        }
        if (verifier) {
            this.verifier = verifier;
        }
        if (verify_time) {
            this.verify_time = verify_time;
        }
        if (comment) {
            this.comment = comment;
        }
    }
}
