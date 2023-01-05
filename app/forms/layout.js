import Navbar from "../../components/navbar";

export default function FormLayout({ children }) {
    return (
        <div className='container'>
            <Navbar/>
            {children}
        </div>
    )
}

