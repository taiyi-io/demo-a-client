'use client';
import { useAppContext } from './context';
import BackButton from './back_button';

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
        invoker: 'Invoker',
        propertyName: 'Property',
        propertyValue: 'Value',
        btnSubmit: 'Submit',
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
        invoker: '申请人',
        propertyName: '属性名',
        propertyValue: '属性值',
        btnSubmit: '提交',
    }
}

export default function SubmitRequest(props) {
    const { lang } = useAppContext();
    const texts = i18n[lang];
    const { data, bankList, mode } = props;
    const { id, customer, amount, minimum_asset, create_time } = data;
    const isManual = 'manual' === mode;
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
            value: amount,
        },
        {
            label: texts.asset,
            value: minimum_asset,
        },
        {
            label: texts.createTime,
            value: create_time,
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
                                id="inputBank" >
                                <option selected>{texts.bankHelper}</option>
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
                            <input className="form-check-input" type="radio" name="modeRadio" id="modeManual" checked={isManual} />
                            <label className="form-check-label" for="modeManual">
                                {texts.modeManual}
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="modeRadio" id="modeContract" checked={!isManual} />
                            <label className="form-check-label" for="modeContract">
                                {texts.modeContract}
                            </label>
                        </div>
                    </div>
                </div>
            </form>
            <div className='row justify-content-center'>
                <div className='col-6'>
                    <div className='d-flex'>
                        <div className='m-1'>
                            <BackButton href='/forms' />
                        </div>
                        <div className='m-1'>
                            <button type="button" className="btn btn-primary btn-sm">
                                <i className='bi bi-plus'></i>
                                {texts.btnSubmit}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}