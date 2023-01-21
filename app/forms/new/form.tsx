'use client';
import { useAppContext } from '../../../components/context';
import BackButton from '../../../components/back_button';
import React, { useEffect } from 'react';

const i18n = {
    en: {
        customer: 'Customer',
        amount: 'Loan Amount',
        asset: 'Minimum Asset',
        btnCreate: 'Create',
        customerHelper: 'choose customer who apply for a loan',
        amountHelper: 'loan amount',
        assetHelper: 'minimum customer asset required for applying',
    },
    cn: {
        customer: '贷款客户',
        amount: '贷款金额',
        asset: '资产要求',
        btnCreate: '提交创建',
        customerHelper: '请选择申请贷款的客户',
        amountHelper: '申请的贷款金额',
        assetHelper: '贷款要求的最低客户资产',
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
    const [status, setStatus] = React.useState(formStatus.idle);
    const [error, setError] = React.useState('');
    const [id, setID] = React.useState('');
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
                            <option selected>{texts.customerHelper}</option>
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
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <i className='bi bi-exclamation-triangle-fill text-danger'></i>
                    <div>
                        An example warning alert with an icon
                    </div>
                </div>
            </div>
            <div className='d-flex'>
                <div className='m-1'>
                    <BackButton href='/forms/' />
                </div>
                <div className='m-1'>
                    <button type="button" className="btn btn-primary btn-sm">
                        <i className='bi bi-plus'></i>
                        {texts.btnCreate}
                    </button>
                </div>
            </div>
        </form>
    )
}