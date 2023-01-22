'use client';
import Link from 'next/link';
import Pagenation from '../../components/pagination';
import { useAppContext, getCurrentyFormatter } from '../../components/context';
import { RecordList, RequestStatus } from '../../components/verify_request';

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
    operate: 'Operates',
    btnNew: 'New Request',
    btnDetail: 'Detail',
    btnManual: 'Manual Approve',
    btnAuto: 'Automatic Approve',
    modified: 'Last Modified',
    approved: 'Approved',
    rejected: 'Rejected',
    modeManual: 'Manual',
    modeContract: 'Smart Contract',
    statusIlde: 'Created',
    statusApproving: 'Approving',
    statusComplete: 'Completed',
    title: 'Verification Requests',
    noRecord: 'No request availalble',
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
    operate: '操作',
    btnNew: '新建申请',
    btnDetail: '详情',
    btnManual: '人工审批',
    btnAuto: '自动审批',
    modified: '最后更新',
    approved: '通过',
    rejected: '拒绝',
    modeManual: '人工处理',
    modeContract: '智能合约',
    statusIlde: '新建',
    statusApproving: '审批中',
    statusComplete: '已完成',
    title: '校验申请',
    noRecord: '尚无申请',
  }
}

export default function Forms({ requests }: {
  requests: RecordList
}) {
  const { offset, size, total, records } = requests;
  const { lang } = useAppContext();
  const texts = i18n[lang];
  let formatter = getCurrentyFormatter();
  const recordPerPage = size;
  let currentPage = 0;
  if (offset >= recordPerPage) {
    currentPage = Math.floor(offset / recordPerPage);
  }
  let totalPages = 0;
  if (0 === total % recordPerPage) {
    totalPages = total / recordPerPage;
  } else {
    totalPages = Math.ceil(total / recordPerPage);
  }
  let content;
  if (records && 0 !== records.length) {
    content = records.map(({ id, customer, amount, bank, verify_mode, result,
      minimum_asset, status, create_time, invoke_time, verify_time }) => {
      let operates = [{
        href: '/forms/view/' + id,
        icon: 'bi-search',
        label: texts.btnDetail,
      }];
      let statusLabel: string, timeLabel: string, resultLabel: string, modeLabel: string;
      if (RequestStatus.Idle === status) {
        statusLabel = texts.statusIlde;
        timeLabel = new Date(create_time).toLocaleString();
        operates.push({
          href: '/forms/manual/' + id,
          icon: 'bi-person-fill',
          label: texts.btnManual,
        }, {
          href: '/forms/auto/' + id,
          icon: 'bi-robot',
          label: texts.btnAuto,
        }
        );
      } else if (RequestStatus.Approving === status) {
        statusLabel = texts.statusApproving;
        timeLabel = new Date(invoke_time).toLocaleString();
        modeLabel = 'manual' === verify_mode ? texts.modeManual : texts.modeContract;
      } else {
        statusLabel = texts.statusComplete;
        timeLabel = new Date(verify_time).toLocaleString();
        resultLabel = result ? texts.approved : texts.rejected;
        modeLabel = 'manual' === verify_mode ? texts.modeManual : texts.modeContract;
      }
      return (
        <tr key={id}>
          <td>{id}</td>
          <td className='text-center'>{customer}</td>
          <td className='text-end'>{formatter.format(amount)}</td>
          <td className='text-end'>{formatter.format(minimum_asset)}</td>
          <td>{bank}</td>
          <td>{statusLabel}</td>
          <td>{modeLabel}</td>
          <td>{resultLabel}</td>
          <td>{timeLabel}</td>
          <td>
            <div className='d-flex'>
              {
                operates.map(({ href, icon, label }, index) => (
                  <Link href={href} key={index}>
                    <button type="button" className="btn btn-outline-primary btn-sm m-1">
                      <i className={'bi ' + icon}></i>
                      {label}
                    </button>
                  </Link>
                ))
              }
            </div>
          </td>
        </tr>
      );
    });
  } else {
    content = (
      <tr className='text-center'>
        <td colSpan={10}>
          {texts.noRecord}
        </td>
      </tr>
    )
  }

  return (
    <div className='container'>
      <div className='row mx-1'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">{texts.title}</li>
          </ol>
        </nav>
        <div className='col col-lg-2 px-3'>
          <Link href='/forms/new/'>
            <button type="button" className="btn btn-primary btn-sm m-1">
              <i className="bi bi-plus"></i>{texts.btnNew}
            </button>
          </Link>
        </div>
        <div className="col-auto">
        </div>
      </div>
      <div className='row m-2 p-2'>
        <table className="table table-hover">
          <thead>
            <tr className="table-primary text-center">
              <th>{texts.id}</th>
              <th>{texts.customer}</th>
              <th>{texts.amount}</th>
              <th>{texts.asset}</th>
              <th>{texts.bank}</th>
              <th>{texts.status}</th>
              <th>{texts.mode}</th>
              <th>{texts.result}</th>
              <th>{texts.modified}</th>
              <th>{texts.operate}</th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </table>
        <Pagenation baseURL='/forms/' current={currentPage} total={totalPages} />
      </div>
    </div>
  )
}

