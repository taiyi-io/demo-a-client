'use client';
import {useAppContext} from '../components/context';

const i18n = {
  en: {
    title: 'Demo - Corporation A',
  },
  cn: {
    title: '演示系统 - 公司A',
  }
}

export default function Header() {
  const { lang } = useAppContext();
  const texts = i18n[lang];
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{texts.title}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}
