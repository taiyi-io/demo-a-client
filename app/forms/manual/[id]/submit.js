'use client';
import {useAppContext} from '../../../../components/context';
import BackButton from '../../../../components/back_button';

const i18n = {
  en: {
    title: 'Submit Request',
    id: 'ID',
    customer: 'Customer',
    bank: 'Bank',
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
    title: '提交审批',
    id: '单据号',
    customer: '客户标识',
    bank: '审批银行',
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

export default function Submit(props){
    const { lang } = useAppContext();
    const texts = i18n[lang];
    const { data } = props;
    const {id, customer, amount, bank, minimum_asset, create_time} = data;
    var parameters = [
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
            <div className='col-12 text-center'>
              <h5>{texts.title}</h5>              
            </div>
            <hr/>
            <table className="table table-hover table-striped">
                <thead>
                    <tr className='table-primary'>
                        <td>{texts.propertyName}</td>
                        <td>{texts.propertyValue}</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        parameters.map(({label, value}, index) => (
                            <tr key={index}>
                                <td>{label}</td>
                                <td>{value}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className='row justify-content-center'>
                <div className='col-2'>
                    <BackButton href='/forms'/>
                </div>
            </div>
        </div>

    )
}