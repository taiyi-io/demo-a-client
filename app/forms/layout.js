import Boot from './bootstrap';

export default function FormLayout({ children }) {
    return (
        <div>
            <Boot/>
            <div className='container'>
                {children}
            </div>
        </div>
    )
  }

  