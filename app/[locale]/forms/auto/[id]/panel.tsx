'use client';
import { useAppContext } from '../../../../../components/context';
import SubmitForm, { formMode } from '../../../../../components/submit_form';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RequestRecord } from '../../../../../components/verify_request';

const i18n = {
    en: {
        forms: 'Verification Requests',
        auto: 'Automatic Approve',
    },
    cn: {
        forms: '校验申请',
        auto: '自动审批',
    }
}

export default function AutoPanel({ record, bankList }: {
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
                        <li className="breadcrumb-item active">{texts.auto}</li>
                    </ol>
                </nav>
            </div>
            <div className='row p-3'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                <SubmitForm record={record} bankList={bankList} mode={formMode.Auto} />
                </div>
            </div>
        </div>
    )
}