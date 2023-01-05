'use client';
import { useAppContext } from '../components/context';
import Link from 'next/link';

const i18n = {
  en: {
    welcome: 'Welcome to Demo for Corporation A',
    title: 'Scenario',
    demo: 'Try Demo',
    scenario: 'Corporation A initiates a bank verification request for the customer\'s loan request, which checks the minimum asset via manual or Smart Contract.Participants can complete the approval without exposing their critical data, such as the loan amount or the customer assets.',
    detail: 'Scenario Details',
    detailURL: 'http://localhost:1314/demo/',
  },
  cn: {
    welcome: '欢迎访问A公司演示系统',
    title: '演示说明',
    demo: '开始体验',
    scenario: '公司A针对客户贷款申请，向指定银行发起验资请求，通过人工或者智能合约方式验资客户是否满足资产要求。参与双方无需暴露各自的关键业务数据，比如客户贷款金额或者银行的资产情况，即可完成审批，有效促进组织间协作。',
    detail: '场景详情',
    detailURL: 'http://localhost:1313/demo/',
  }
}

function HomePage() {
  const { lang, version } = useAppContext();
  const texts = i18n[lang];
  return (
    <div className='container'>
      <div className='row justify-content-center p-5'>
        <div className='col-2'>
        </div>
        <div className='col-8'>
          <div className="card" style={{ width: '18 rem' }}>
            <div className="card-header">
              {texts.welcome + ' ' + version}
            </div>
            <div className="card-body">
              <h5 className="card-title">{texts.title}</h5>
              <p className="card-text">{texts.scenario}</p>
              <div className='d-flex'>
                <a href="/forms/" className="btn btn-primary mx-3">{texts.demo}</a>
                <a href={texts.detailURL} className="btn btn-outline-primary mx-3">{texts.detail}</a>
              </div>

            </div>
          </div>

        </div>
        <div className='col-2' />
      </div>
    </div>
  )
}

export default HomePage
