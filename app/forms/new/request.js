'use client';
import {useAppContext} from '../../../components/context';
import BackButton from '../../../components/back_button';

function createForm(customer, amount, minimum_asset, onSuccess, onFail){
    //todo: create new request
}

function onCustomerChanged(){

}

const i18n = {
    en: {
        title: 'Create New Request',
        customer: 'Customer',
        amount: 'Loan Amount',
        asset: 'Minimum Asset',
        btnCreate: 'Create',
        customerHelper: 'choose customer who apply for a loan',
        amountHelper: 'loan amount',
        assetHelper: 'minimum customer asset required for applying',
    },
    cn: {
        title: '新建审批申请',
        customer: '贷款客户',
        amount: '贷款金额',
        asset: '资产要求',
        btnCreate: '提交创建',
        customerHelper: '请选择申请贷款的客户',
        amountHelper: '申请的贷款金额',
        assetHelper: '贷款要求的最低客户资产',
    }
}

export default function CreateForm(props){
    const { lang, user } = useAppContext();
    const { users, onCreate } = props;
    const texts = i18n[lang];
    return (
        <form>
            <div className='col-12 text-center'>
              <h5>{texts.title}</h5>              
            </div>
            <hr/>
            <div className='row'>
                <div className='col-5'>
                    <div className="mb-3">
                        <label htmlFor="inputCustomer" className="form-label">{texts.customer}</label>                        
                        <select 
                            className="form-select form-select-sm" 
                            aria-label="select-customer" 
                            id="inputCustomer" >   
                            <option selected>{texts.customerHelper}</option>                         
                            {
                                users.map((id, index) =><option key={index} value={id}>{id}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    <div className="mb-3">
                        <label htmlFor="inputAmount" className="form-label">{texts.amount}</label>
                        <input type="text" className="form-control form-control-sm" id="inputAmount" aria-describedby="amountHelp"/>
                        <div id="amountHelp" className="form-text">{texts.amountHelper}</div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    <div className="mb-3">
                        <label htmlFor="inputAsset" className="form-label">{texts.asset}</label>
                        <input type="text" className="form-control form-control-sm" id="inputAsset" aria-describedby="assetHelper"/>
                        <div id="assetHelper" className="form-text">{texts.assetHelper}</div>
                    </div>
                </div>
            </div>            
            <div className='d-flex'>
                <div className='m-1'>
                    <BackButton href='/forms/'/>
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