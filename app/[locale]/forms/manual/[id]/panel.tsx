'use client';
import { useAppContext } from '../../../../../components/context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SubmitForm, { formMode } from '../../../../../components/submit_form';
import { RequestRecord } from '../../../../../components/verify_request';

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

export default function ManualPanel({ record, bankList }: {
    record: RequestRecord,
    bankList: string[],
}) {
    const currentPath = usePathname();
    const { lang } = useAppContext();
    const texts = i18n[lang];
    return (
        <div className='container'>
            <div className='row mx-1'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href={currentPath + '/../..'}>{texts.forms}</Link></li>
                        <li className="breadcrumb-item active">{texts.manual}</li>
                    </ol>
                </nav>
            </div>
            <div className='row p-3'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <SubmitForm record={record} bankList={bankList} mode={formMode.Manual} />
                </div>
            </div>
        </div>
    )
}