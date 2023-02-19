'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

function HomePage({searchParams}) {
  const router = useRouter();
  React.useEffect(() =>{
    let language = searchParams.lang;
    if (language && 'en' === language){
      router.push('/en-us/');
    }else{
      router.push('/zh-cn/');
    }
  }, [router, searchParams]);

  return <div/>
}

export default HomePage
