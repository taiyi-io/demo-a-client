'use client';
import { useAppContext } from '../../../components/context';
import Link from 'next/link';
import CreateForm from './request';

const i18n = {
    en: {
        forms: 'Verification Requests',
        new: 'Create New Request',
    },
    cn: {
        forms: '校验申请',
        new: '新建审批申请',
    }
}

export default function NewPanel({ users }) {
    const { lang } = useAppContext();
    const texts = i18n[lang];
    return (
        <div className='container'>
            <div className='row mx-1'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href='/forms'>{texts.forms}</Link></li>
                        <li className="breadcrumb-item active">{texts.new}</li>
                    </ol>
                </nav>
            </div>
            <div className='row p-3'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <CreateForm users={users} />
                </div>
            </div>
        </div>
    )
}