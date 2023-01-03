'use client';
import Link from 'next/link';
import Pagenation from '../../components/pagination';
import {useAppContext} from '../../components/context';

const i18n = {
  en: {
    id: 'ID',
    customer: 'Customer',
    bank: 'Bank',
    amount: 'Amount',
    mode: 'Verify Mode',
    result: 'Verify Result',
    status: 'Status',
    invoke: 'Invoke Time',
    verify: 'Verify Time',
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
  },
  cn: {
    id: '单据号',
    customer: '客户标识',
    bank: '审批银行',
    amount: '申请金额',
    mode: '验证模式',
    result: '验证结果',
    status: '状态',
    invoke: '提交时间',
    verify: '验证时间',
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
  }
}

export default function Forms(props){
    const { offset, size, total, records } = props;
    const { lang } = useAppContext();
    const texts = i18n[lang];
    const recordPerPage = size;
    var currentPage = 0;
    if (offset >= recordPerPage){
      currentPage = Math.floor(offset / recordPerPage);
    }
    let totalPages = 0;
    if (0 === total % recordPerPage) {
      totalPages = total / recordPerPage;
    } else {
      totalPages = Math.ceil(total / recordPerPage);
    }
    return (
        <div class='container'>
          <div class='row m-2 p-2'>
            <div class='col col-lg-2'>
              <Link href='/forms/new/'>
                <button type="button" class="btn btn-primary btn-sm m-1">
                  <i class="bi bi-plus"></i>{texts.btnNew}
                </button>
              </Link>
            </div>
            <div class="col-auto">

            </div>
          </div>
          <div class='row m-2 p-2'>
            <table class="table table-hover">
              <thead>
                <tr class="table-primary">
                  <th>{texts.id}</th>
                  <th>{texts.customer}</th>
                  <th>{texts.amount}</th>
                  <th>{texts.bank}</th>
                  <th>{texts.mode}</th>
                  <th>{texts.result}</th>
                  <th>{texts.status}</th>
                  <th>{texts.invoke}</th>
                  <th>{texts.verify}</th>
                  <th>{texts.operate}</th>
                </tr>
              </thead>
              <tbody>
              {
                records.map(({id, customer, amount, bank, verify_mode, result,
                status, invoke_time, verify_time}) => {
      
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{customer}</td>
                      <td>{amount}</td>
                      <td>{bank}</td>
                      <td>{'manual' === verify_mode? texts.modeManual: texts.modeContract}</td>
                      <td>{result? texts.approved: texts.rejected}</td>
                      <td>{status}</td>
                      <td>{invoke_time}</td>
                      <td>{verify_time}</td>
                      <td>
                        <div class='d-flex'>
                          <Link href={'/forms/view/' + id}>
                            <button type="button" class="btn btn-outline-primary btn-sm m-1">
                              <i class="bi bi-search"></i>
                              {texts.btnDetail}
                            </button>
                          </Link>
                          <Link href={'/forms/manual/' + id}>
                            <button type="button" class="btn btn-outline-primary btn-sm m-1">
                              <i class="bi bi-person-fill"></i>
                              {texts.btnManual}
                            </button>
                          </Link>
                          <Link href={'/forms/auto/' + id}>
                            <button type="button" class="btn btn-outline-primary btn-sm m-1">
                              <i class="bi bi-robot"></i>
                              {texts.btnAuto}
                            </button>
                          </Link>
                        </div>
                        
                      </td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
            <Pagenation baseURL='/forms/' current={currentPage} total={totalPages}/>
          </div>
        </div>
      )
}

