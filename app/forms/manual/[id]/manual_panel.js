'use client';
import { useAppContext } from '../../../../components/context';
import SubmitRequest from '../../../../components/submit_request';
import Link from 'next/link';

const i18n = {
    en: {
        forms: 'Verification Requests',
        manual: 'Manual Approve',
    },
    cn: {
        forms: '校验申请',
        manual: '人工审批',
    }
}

export default function ManualPanel({ data, bankList, mode }) {
    const { lang } = useAppContext();
    const texts = i18n[lang];
    return (
        <div className='container'>
            <div className='row mx-1'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href='/forms'>{texts.forms}</Link></li>
                        <li className="breadcrumb-item active">{texts.manual}</li>
                    </ol>
                </nav>
            </div>
            <div className='row p-3'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <SubmitRequest data={data} bankList={bankList} mode='manual' />
                </div>
            </div>
        </div>
    )
}