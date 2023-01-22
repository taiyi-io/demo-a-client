'use client';
import { useAppContext } from '../../../components/context';
import BackButton from '../../../components/back_button';
import React, { useEffect } from 'react';
import Link from 'next/link';
import strings from '@supercharge/strings/dist';
import { useRouter } from 'next/navigation';
import { ResponsePayload } from '../../../pages/api/response';

const i18n = {
    en: {
        customer: 'Customer',
        amount: 'Loan Amount',
        asset: 'Minimum Asset',
        btnCreate: 'Create',
        btnCreating: 'Creating...',
        customerHelper: 'choose customer who apply for a loan',
        amountHelper: 'loan amount',
        assetHelper: 'minimum customer asset required for applying',
        invalidCustomer: 'customer required',
        invalidAmount: 'Amount must greater than 0',
        invalidAsset: 'Minimum asset must greater than 0',
        formatSuccess: 'New request {0} created successful',
        countDown: 'Count down {0} seconds',
        linkList: 'Return to list',
    },
    cn: {
        customer: '贷款客户',
        amount: '贷款金额',
        asset: '资产要求',
        btnCreate: '提交创建',
        btnCreating: '创建中...',
        customerHelper: '请选择申请贷款的客户',
        amountHelper: '申请的贷款金额',
        assetHelper: '贷款要求的最低客户资产',
        invalidCustomer: '必须指定贷款客户',
        invalidAmount: '申请额度必须大于0',
        invalidAsset: '要求资产必须大于0',
        formatSuccess: '新申请"{0}"已成功创建',
        countDown: '倒计时{0}秒',
        linkList: '返回列表',
    }
}

enum formStatus {
    idle = 0,
    committing,
    success,
}

export default function CreateForm({ users }: {
    users: string[],
}) {
    interface formData {
        customer: string,
        amount: number,
        asset: number,
    };
    const initialData: formData = {
        customer: '',
        amount: 0,
        asset: 0
    };
    const { lang, user } = useAppContext();
    const texts = i18n[lang];
    const listURL = '/forms';
    const DEFAULT_COUNT_DOWN = 5;
    const router = useRouter();
    const [status, setStatus] = React.useState(formStatus.idle);
    const [error, setError] = React.useState('');
    const [id, setID] = React.useState('');
    const [countDown, setCountDown] = React.useState(DEFAULT_COUNT_DOWN);
    const [data, setData] = React.useState(initialData);

    const showError = React.useCallback((msg: string) => {
        setStatus(formStatus.idle);
        setError(msg);
    }, []);

    const handleCustomerChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value;
        setData(previous => ({
            ...previous,
            customer: value,
        }));
    };

    const handleAmountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let number = Number.parseInt(value);
        if (Number.isNaN(number)) {
            return;
        }
        setData(previous => ({
            ...previous,
            amount: number,
        }));
    };

    const handleAssetChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let number = Number.parseInt(value);
        if (Number.isNaN(number)) {
            return;
        }
        setData(previous => ({
            ...previous,
            asset: number,
        }));
    };

    const handleSumit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!data.customer) {
            showError(texts.invalidCustomer);
            return;
        }
        if (data.amount <= 0) {
            showError(texts.invalidAmount);
            return;
        }
        if (data.asset <= 0) {
            showError(texts.invalidAsset);
            return;
        }
        const payload = {
            ...data,
            creator: user,
        };
        const url = '/api/requests/';
        const options: RequestInit = {
            method: 'POST',
            body: JSON.stringify(payload),
        };
        setStatus(formStatus.committing);
        let resp = await fetch(url, options);
        if (!resp.ok){
            showError(resp.statusText);
            return;
        }
        let result = (await resp.json() as ResponsePayload);
        if (0 !== result.error_code){
            showError(result.message);
            return;
        }
        setID(result.data.id);
        setStatus(formStatus.success);
    };

    React.useEffect(() => {
        if (formStatus.success === status){
            if (countDown > 0){
                setTimeout(() => {
                    setCountDown(countDown - 1);
                }, 1000);
            }else{
                router.push(listURL);
            }
        }
    }, [status, countDown]);

    if (formStatus.success === status) {
        //
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
            buttonText = texts.btnCreate;
        } else {
            buttonIcon = (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>);
            buttonText = texts.btnCreating;
        }
        return (
            <form>
                <div className='row'>
                    <div className='col-5'>
                        <div className="mb-3">
                            <label htmlFor="inputCustomer" className="form-label">{texts.customer}</label>
                            <select
                                className="form-select form-select-sm"
                                aria-label="select-customer"
                                id="inputCustomer"
                                value={data.customer}
                                onChange={handleCustomerChanged}
                            >
                                <option value=''>{texts.customerHelper}</option>
                                {
                                    users.map((id, index) => <option key={index} value={id}>{id}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <div className="mb-3">
                            <label htmlFor="inputAmount" className="form-label">{texts.amount}</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="inputAmount"
                                aria-describedby="amountHelp"
                                value={data.amount}
                                onChange={handleAmountChanged}
                            />
                            <div id="amountHelp" className="form-text">{texts.amountHelper}</div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <div className="mb-3">
                            <label htmlFor="inputAsset" className="form-label">{texts.asset}</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="inputAsset"
                                aria-describedby="assetHelper"
                                value={data.asset}
                                onChange={handleAssetChanged}
                            />
                            <div id="assetHelper" className="form-text">{texts.assetHelper}</div>
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
                <div className='d-flex'>
                    <div className='m-1'>
                        <BackButton href='/forms/' disabled={isCommiting} />
                    </div>
                    <div className='m-1'>
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleSumit} disabled={isCommiting}>
                            {buttonIcon}
                            {buttonText}
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}