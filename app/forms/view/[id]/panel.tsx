'use client';
import { useAppContext } from '../../../../components/context';
import BackButton from '../../../../components/back_button';
import FormDetail from './form';
import Link from 'next/link';
import { RequestRecord } from '../../../../components/verify_request';

const i18n = {
    en: {
        forms: 'Verification Requests',
        detail: 'Detail',
    },
    cn: {
        forms: '校验申请',
        detail: '详情',
    }
}

export default function DetailPanel({record}:{
    record: RequestRecord,
}) {
    const { lang } = useAppContext();
    const texts = i18n[lang];
    return (
        <div className='container'>
            <div className='row mx-1'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href='/forms'>{texts.forms}</Link></li>
                        <li className="breadcrumb-item active">{texts.detail}</li>
                    </ol>
                </nav>
            </div>
            <div className='row p-3'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <FormDetail record={record} />
                </div>
            </div>
            <div className='row pb-3 justify-content-center'>
                <div className='col-2'>
                    <BackButton href='/forms' />
                </div>
            </div>
        </div>
    )
}