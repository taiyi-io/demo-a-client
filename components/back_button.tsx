'use client';
import React from 'react';
import { useAppContext } from './context';

const i18n = {
    en: {
        back: 'Back',
    },
    cn: {
        back: '返回',
    }
};

export default function BackButton({ href, disabled }: {
    href: string,
    disabled?: boolean,
}) {
    const { lang } = useAppContext();
    const texts = i18n[lang];
    if (disabled) {
        return (
            <button type="button" className="btn btn-sm btn-outline-secondary disabled">
                <i className="bi bi-chevron-left"></i>
                {texts.back}
            </button>
        )
    } else {
        return (
            <a href={href}>
                <button type="button" className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-chevron-left"></i>
                    {texts.back}
                </button>
            </a>
        )
    }
}