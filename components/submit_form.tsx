'use client';
import { getCurrentyFormatter, useAppContext } from './context';
import BackButton from './back_button';
import { RequestRecord, VerifyMode } from './verify_request';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ResponsePayload } from '../pages/api/response';
import Link from 'next/link';
import strings from '@supercharge/strings/dist';

const i18n = {
    en: {
        id: 'ID',
        customer: 'Customer',
        bank: 'Bank',
        bankHelper: 'Please choose the bank for verifying',
        amount: 'Amount',
        asset: 'Minimal Asset',
        mode: 'Verify Mode',
        modeManual: 'Manual',
        modeContract: 'Automatic (By Smart Contract)',
        createTime: 'Create Time',
        propertyName: 'Property',
        propertyValue: 'Value',
        invalidBank: 'Bank required',
        formatSuccess: 'Request {0} successful submitted',
        countDown: 'Count down {0} seconds',
        linkList: 'Return to list',
        btnSubmit: 'Submit',
        btnSubmiting: 'Submiting...',
    },
    cn: {
        id: '单据号',
        customer: '客户标识',
        bank: '审批银行',
        bankHelper: '请选择进行审批的银行',
        amount: '申请金额',
        asset: '资产要求',
        mode: '验证模式',
        modeManual: '人工处理',
        modeContract: '自动处理(使用智能合约)',
        createTime: '创建时间',
        propertyName: '属性名',
        propertyValue: '属性值',
        invalidBank: '必须指定审批银行',
        formatSuccess: '申请"{0}"已成功提交',
        countDown: '倒计时{0}秒',
        linkList: '返回列表',
        btnSubmit: '提交',
        btnSubmiting: '提交中...',
    }
}

enum formStatus {
    idle = 0,
    committing,
    success,
}

export enum formMode {
    Auto = 'auto',
    Manual = 'manual',
}

export default function SubmitForm({ record, bankList, mode }: {
    record: RequestRecord,
    bankList: string[],
    mode: formMode,
}) {
    interface formData {
        bank: string,
        mode: string,
    };
    let initialData: formData = {
        bank: '',
        mode: '',
    };
    if (formMode.Auto === mode) {
        initialData.mode = VerifyMode.Contract;
    } else {
        initialData.mode = VerifyMode.Manual;
    }
    const { lang, user } = useAppContext();
    const texts = i18n[lang];
    const { id, customer, amount, minimum_asset, create_time } = record;

    const listURL = '/forms';
    const DEFAULT_COUNT_DOWN = 5;
    const router = useRouter();
    const [status, setStatus] = React.useState(formStatus.idle);
    const [error, setError] = React.useState('');
    const [countDown, setCountDown] = React.useState(DEFAULT_COUNT_DOWN);
    const [data, setData] = React.useState(initialData);

    let formatter = getCurrentyFormatter();
    const isManual = VerifyMode.Manual === data.mode;

    const showError = React.useCallback((msg: string) => {
        setError(msg);
        setStatus(formStatus.idle);
    }, []);

    const handleBankChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value;
        setData(previous => ({
            ...previous,
            bank: value,
        }));
    };

    const handleModeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.id;
        setData(previous => ({
            ...previous,
            mode: value,
        }));
    };

    const handleSumit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!data.bank) {
            showError(texts.invalidBank);
            return;
        }
        const payload = {
            ...data,
            invoker: user,
        };
        const url = '/api/requests/' + id;
        const options: RequestInit = {
            method: 'PUT',
            body: JSON.stringify(payload),
        };
        setStatus(formStatus.committing);
        let resp = await fetch(url, options);
        if (!resp.ok) {
            showError(resp.statusText);
            return;
        }
        let result = (await resp.json() as ResponsePayload);
        if (0 !== result.error_code) {
            showError(result.message);
            return;
        }
        setStatus(formStatus.success);
        setCountDown(DEFAULT_COUNT_DOWN);
    };

    React.useEffect(() => {
        if (formStatus.success === status){
            if (countDown > 0){                
                let next = countDown - 1;
                if (next > 0){
                    setTimeout(() => {                    
                        setCountDown(next);
                    }, 1000);
                }else{
                    setTimeout(() => {                    
                        router.push(listURL);
                    }, 1000);
                }
            }
        }
    }, [status, countDown]);
    if (formStatus.success === status) {
        let title: string = strings(texts.formatSuccess).replace('{0}', id).get();
        let countDownLabel = strings(texts.countDown).replace('{0}', countDown.toString()).get();
        return (
            <div className='text-center p-3 m-5'>
                <h5>
                    {title}
                </h5>
                <div className='my-4'>
                    {countDownLabel}
                </div>
                <Link href={listURL}>
                    {texts.linkList}
                </Link>
            </div>
        )
    } else {
        let buttonIcon: React.ReactElement, buttonText: string;
        let isCommiting = (formStatus.committing === status);
        if (!isCommiting) {
            buttonIcon = (<i className='bi bi-plus'></i>);
            buttonText = texts.btnSubmit;
        } else {
            buttonIcon = (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>);
            buttonText = texts.btnSubmiting;
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
                label: texts.createTime,
                value: create_time ? new Date(create_time).toLocaleString() : '',
            },
        ]
        return (
            <div>
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
                <form>
                    <div className='row'>
                        <div className='col-6'>
                            <div className="mb-3">
                                <label htmlFor="inputBank" className="form-label">{texts.bank}</label>
                                <select
                                    className="form-select form-select-sm"
                                    aria-label="select-bank"
                                    id="inputBank"
                                    value={data.bank}
                                    onChange={handleBankChanged}
                                >
                                    <option value=''>{texts.bankHelper}</option>
                                    {
                                        bankList.map((id, index) => <option key={index} value={id}>{id}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="mb-3">
                            <label htmlFor="inputMode" className="form-label">{texts.mode}</label>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="modeRadio"
                                    id={VerifyMode.Manual}
                                    defaultChecked={isManual}
                                    onChange={handleModeChanged}
                                />
                                <label className="form-check-label" htmlFor={VerifyMode.Manual}>
                                    {texts.modeManual}
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="modeRadio"
                                    id={VerifyMode.Contract}
                                    defaultChecked={!isManual}
                                    onChange={handleModeChanged}
                                />
                                <label className="form-check-label" htmlFor={VerifyMode.Contract}>
                                    {texts.modeContract}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {
                            error ? (
                                <div className="alert alert-warning d-flex align-items-center" role="alert">
                                    <i className='bi bi-exclamation-triangle-fill text-danger'></i>
                                    <div>
                                        {error}
                                    </div>
                                </div>
                            ) : <div />
                        }
                    </div>
                </form>
                <div className='row justify-content-center'>
                    <div className='col-6'>
                        <div className='d-flex'>
                            <div className='m-1'>
                                <BackButton href='/forms' disabled={isCommiting} />
                            </div>
                            <div className='m-1'>
                                <button type="button" className="btn btn-primary btn-sm" onClick={handleSumit} disabled={isCommiting}>
                                    {buttonIcon}
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}