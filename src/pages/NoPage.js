import { useNavigate } from 'react-router-dom';
import './NoPage.css'

export default function NoPage() {
    // function to handle 404 errors

    const navigate = useNavigate();

    const returnHome = () => {
        navigate('/notes')
    }

    return (
        <div className='no-page-container'>
            <h1>404 - Page Does Not Exist</h1>
            <button id='return-home' onClick={returnHome}>Return to Home</button>
        </div>
    );
}