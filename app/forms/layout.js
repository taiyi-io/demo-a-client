import Navbar from "../../components/navbar";

export default function FormLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div className='container'>
                {children}
            </div>
        </div>
    )
}

