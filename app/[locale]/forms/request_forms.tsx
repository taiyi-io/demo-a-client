'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Pagenation from '../../../components/pagination';
import { useAppContext, getCurrentyFormatter } from '../../../components/context';
import { RecordList, RequestStatus, VerifyMode } from '../../../components/verify_request';
import React from 'react';
import { keepAlive } from '../../../components/api_utils';
import strings from '@supercharge/strings/dist';

const i18n = {
  en: {
    id: 'ID',
    customer: 'Customer',
    amount: 'Amount',
    asset: 'Minimal Asset',
    status: 'Status',
    operate: 'Operates',
    btnNew: 'New Request',
    btnDetail: 'Detail',
    btnManual: 'Manual Approve',
    btnAuto: 'Automatic Approve',
    btnHistory: 'History',
    modified: 'Last Modified',
    title: 'Verification Requests',
    noRecord: 'No request availalble',
    statusIdle: 'Idle',
    statusManualApproving: 'Approving by {0}',
    statusManualApproved: 'Approved by {0}',
    statusManualRejected: 'Rejected by {0}',
    statusAutoApproving: 'Automatic Approving',
    statusAutoApproved: 'Automatic Approved',
    statusAutoRejected: 'Automatic Rejected',
  },
  cn: {
    id: '单据号',
    customer: '客户标识',
    amount: '申请金额',
    asset: '资产要求',
    status: '状态',
    operate: '操作',
    btnNew: '新建申请',
    btnDetail: '详情',
    btnManual: '人工审批',
    btnAuto: '自动审批',
    btnHistory: '变更历史',
    modified: '最后更新',
    title: '校验申请',
    noRecord: '尚无申请',
    statusIdle: '新建',
    statusManualApproving: '{0}审批中',
    statusManualApproved: '{0}已批准',
    statusManualRejected: '{0}已否决',
    statusAutoApproving: '自动审批中',
    statusAutoApproved: '已自动批准',
    statusAutoRejected: '已自动否决',
  }
}

export default function Forms({ requests }: {
  requests: RecordList
}) {
  const { offset, size, total, records } = requests;
  const { lang } = useAppContext();
  const currentPath = usePathname();
  const texts = i18n[lang];
  const aliveInterval = 1000 * 10;
  React.useEffect(() => {
    let intervalID = setInterval(async () => {
      await keepAlive();
    }, aliveInterval);
    return () => {
      clearInterval(intervalID);
    };
  }, []);
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
      let operates = [
        {
          href: '/view/' + id,
          icon: 'bi-search',
          label: texts.btnDetail,
        }];

      let isManual = VerifyMode.Manual === verify_mode;
      let statusLabel: string, timeLabel: string;
      if (RequestStatus.Idle === status) {
        statusLabel = texts.statusIdle;
        timeLabel = new Date(create_time).toLocaleString();
        operates.push({
          href: '/manual/' + id,
          icon: 'bi-person-fill',
          label: texts.btnManual,
        }, {
          href: '/auto/' + id,
          icon: 'bi-robot',
          label: texts.btnAuto,
        });
      } else {
        operates.push({
          href: '/history/' + id,
          icon: 'bi-clock-history',
          label: texts.btnHistory,
        });
        if (RequestStatus.Approving === status) {
          if (isManual) {
            statusLabel = strings(texts.statusManualApproving).replace('{0}', bank as string).get();
          } else {
            statusLabel = texts.statusAutoApproving;
          }
          timeLabel = new Date(invoke_time as string).toLocaleString();
        } else {
          if (isManual) {
            if (result) {
              statusLabel = strings(texts.statusManualApproved).replace('{0}', bank as string).get();
            } else {
              statusLabel = strings(texts.statusManualRejected).replace('{0}', bank as string).get();
            }
          } else {
            if (result) {
              statusLabel = texts.statusAutoApproved;
            } else {
              statusLabel = texts.statusAutoRejected;
            }
          }
          timeLabel = new Date(verify_time as string).toLocaleString();
        }
      }
      return (
        <tr key={id}>
          <td>{id}</td>
          <td className='text-center'>{customer}</td>
          <td className='text-end'>{formatter.format(amount)}</td>
          <td className='text-end'>{formatter.format(minimum_asset)}</td>
          <td className='text-center'>{statusLabel}</td>
          <td className='text-center'>{timeLabel}</td>
          <td>
            <div className='d-flex'>
              {
                operates.map(({ href, icon, label }, index) => (
                  <a href={currentPath + href} key={index}>
                    <button type="button" className="btn btn-outline-primary btn-sm m-1">
                      <i className={'bi ' + icon}></i>
                      {label}
                    </button>
                  </a>
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
          <a href={currentPath + '/new/'}>
            <button type="button" className="btn btn-primary btn-sm m-1">
              <i className="bi bi-plus"></i>{texts.btnNew}
            </button>
          </a>
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
              <th>{texts.status}</th>
              <th>{texts.modified}</th>
              <th>{texts.operate}</th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </table>
        <Pagenation baseURL={currentPath as string} current={currentPage} total={totalPages} />
      </div>
    </div>
  )
}

