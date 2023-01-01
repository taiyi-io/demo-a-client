import Boot from './bootstrap';

export default function FormLayout({ children }) {
    return (
        <div>
            <Boot/>
            <div class='container'>
                {children}
            </div>
        </div>
    )
  }

  