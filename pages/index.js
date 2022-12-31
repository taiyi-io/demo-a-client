import Link from 'next/link';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Demo for corporation A</h1>
      <Link href='/forms'>Browse requesting forms</Link>
    </div>
  )
}

export default HomePage
