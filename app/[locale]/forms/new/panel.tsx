'use client';
import { useAppContext } from '../../../../components/context';
import CreateForm from './form';
import { usePathname } from 'next/navigation';

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

export default function NewPanel({ users }: {
    users: string[],
}) {
    const currentPath = usePathname();
    const { lang } = useAppContext();
    const texts = i18n[lang];
    return (
        <div className='container'>
            <div className='row mx-1'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href={currentPath + '/..'}>{texts.forms}</a></li>
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