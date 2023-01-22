'use client';
import { getCurrentyFormatter, useAppContext } from '../../../../components/context';
import { RequestRecord } from '../../../../components/verify_request';

const i18n = {
    en: {
        id: 'ID',
        customer: 'Customer',
        bank: 'Bank',
        amount: 'Amount',
        asset: 'Minimal Asset',
        mode: 'Verify Mode',
        result: 'Verify Result',
        status: 'Status',
        approved: 'Approved',
        rejected: 'Rejected',
        modeManual: 'Manual',
        modeContract: 'Smart Contract',
        statusIlde: 'Created',
        statusApproving: 'Approving',
        statusComplete: 'Completed',
        createTime: 'Create Time',
        invokeTime: 'Invoke Time',
        completeTime: 'Complete Time',
        verifier: 'Verifier',
        invoker: 'Invoker',
        propertyName: 'Property',
        propertyValue: 'Value',
    },
    cn: {
        id: '单据号',
        customer: '客户标识',
        bank: '审批银行',
        amount: '申请金额',
        asset: '资产要求',
        mode: '验证模式',
        result: '验证结果',
        status: '状态',
        approved: '通过',
        rejected: '拒绝',
        modeManual: '人工处理',
        modeContract: '智能合约',
        statusIlde: '新建',
        statusApproving: '审批中',
        statusComplete: '已完成',
        createTime: '创建时间',
        invokeTime: '提交时间',
        completeTime: '完成时间',
        verifier: '审批者',
        invoker: '申请人',
        propertyName: '属性名',
        propertyValue: '属性值',
    }
}


const enumIdle = 0;
const enumApproving = 1;

export default function FormDetail({ record }: {
    record: RequestRecord,
}) {
    const { lang } = useAppContext();
    const texts = i18n[lang];
    let formatter = getCurrentyFormatter();
    const { id, customer, amount, bank, verify_mode, result, invoker, verifier,
        minimum_asset, status, create_time, invoke_time, verify_time } = record;
    let statusLabel: string, resultLabel: string;
    if (enumIdle === status) {
        statusLabel = texts.statusIlde;
    } else if (enumApproving === status) {
        statusLabel = texts.statusApproving;
    } else {
        statusLabel = texts.statusComplete;
        resultLabel = result ? texts.approved : texts.rejected;
    }
    let parameters = [
        {
            label: texts.id,
            value: id,
        },
        {
            label: texts.customer,
            value: customer,
        },
        {
            label: texts.amount,
            value: formatter.format(amount),
        },
        {
            label: texts.asset,
            value: formatter.format(minimum_asset),
        },
        {
            label: texts.bank,
            value: bank,
        },
        {
            label: texts.mode,
            value: 'manual' === verify_mode ? texts.modeManual : texts.modeContract,
        },
        {
            label: texts.result,
            value: resultLabel,
        },
        {
            label: texts.status,
            value: statusLabel,
        },
        {
            label: texts.invoker,
            value: invoker,
        },
        {
            label: texts.createTime,
            value: create_time? new Date(create_time).toLocaleString(): '',
        },
        {
            label: texts.invokeTime,
            value: invoke_time? new Date(invoke_time).toLocaleString(): '',
        },
        {
            label: texts.verifier,
            value: verifier,
        },
        {
            label: texts.completeTime,
            value: verify_time? new Date(verify_time).toLocaleString(): '',
        },
    ]
    return (
        <table className="table table-hover table-striped">
            <thead>
                <tr className='table-primary'>
                    <td>{texts.propertyName}</td>
                    <td>{texts.propertyValue}</td>
                </tr>
            </thead>
            <tbody>
                {
                    parameters.map(({ label, value }, index) => (
                        <tr key={index}>
                            <td>{label}</td>
                            <td>{value}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>

    )
}