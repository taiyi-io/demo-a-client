'use client';
import {useAppContext} from '../../../components/context';
import BackButton from '../../../components/back_button';

function createForm(customer, amount, minimum_asset, onSuccess, onFail){
    //todo: create new request
}

const i18n = {
    en: {
        title: 'Create New Request',
        customer: 'Customer',
        amount: 'Loan Amount',
        asset: 'Minimum Asset',
        btnCreate: 'Create',
        customerHelper: 'customer who apply for a loan',
        amountHelper: 'loan amount',
        assetHelper: 'minimum customer asset required for applying',
    },
    cn: {
        title: '新建审批申请',
        customer: '客户',
        amount: '贷款金额',
        asset: '资产要求',
        btnCreate: '提交创建',
        customerHelper: '申请贷款的客户标识',
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
              <h3>{texts.title}</h3>              
            </div>
            <div className='row'>
                <div className='col-6'>
                    <div class="mb-3">
                        <label for="inputAmount" class="form-label">{texts.amount}</label>
                        <input type="text" class="form-control" id="inputAmount" aria-describedby="amountHelp"/>
                        <div id="amountHelp" class="form-text">{texts.amountHelper}</div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    <div class="mb-3">
                        <label for="inputAsset" class="form-label">{texts.asset}</label>
                        <input type="text" class="form-control" id="inputAsset" aria-describedby="assetHelper"/>
                        <div id="assetHelper" class="form-text">{texts.assetHelper}</div>
                    </div>
                </div>
            </div>
            
            <hr/>
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