'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  React.useEffect(() =>{
    if (searchParams && searchParams.lang && 'en' === searchParams.lang){
      router.push('/en-us/');
    }else{
      router.push('/zh-cn/');
    }
  }, [router, searchParams]);

  return <div/>
}

export default HomePage
