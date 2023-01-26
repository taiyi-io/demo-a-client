import { ContractDefine } from "./chain_sdk";

export const VERIFY_CONTRACT_NAME = 'verify_asset';
export const ASSET_SCHEMA_NAME = 'customer_asset';
export const CONTRACT_DEFINE: ContractDefine = {
    "steps":
        [
            { "action": "declare_string", "params": ["$request_schema", "verify_request"] },
            { "action": "declare_string", "params": ["$asset_schema", "customer_asset"] },
            { "action": "get_property", "params": ["$status", "$request_schema", "@1", "status"] },
            { "action": "require", "params": ["$status", "==", "1"] },
            { "action": "get_property", "params": ["$request_asset", "$request_schema", "@1", "minimum_asset"] },
            { "action": "get_property", "params": ["$customer", "$request_schema", "@1", "customer"] },
            { "action": "get_property", "params": ["$asset", "$asset_schema", "$customer", "asset"] },
            { "action": "require", "params": ["$asset", ">=", "$request_asset"] },
            { "action": "get_doc", "params": ["$record", "$request_schema", "@1"] },
            { "action": "get_property", "params": ["$verify_time", "$request_schema", "@1", "invoke_time"] },
            { "action": "set_property", "params": ["$record", "verifier", "contract - sample"] },
            { "action": "set_property", "params": ["$record", "verify_time", "$verify_time"] },
            { "action": "set_property", "params": ["$record", "result", "true"] },
            { "action": "set_property", "params": ["$record", "status", "2"] },
            { "action": "update_doc", "params": ['$asset_schema', '$record'] },
            { "action": "submit", "params": [] }
        ],
    "parameters": [
        { "name": "recordID", "description": "请求编号" }
    ]
};