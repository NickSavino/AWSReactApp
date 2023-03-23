import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



import './Note.css'

function Note(props) {

    const navigate = useNavigate();

    const noteIndex = useParams()["index"];

    const [data, setData] = useState(props.noteData);  

    const [content, setContent] = useState();



    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    useEffect(() => {
        setData(props.noteData);
    }, [])

    useEffect(() => {
        setData(props.noteData);
        if (JSON.stringify(data.index) !== noteIndex) {
            document.getElementById(data.id).classList.remove("selected");
        }
        else {
            document.getElementById(data.id).classList.add("selected");
        }
    }, )

    useEffect(() => {
        setContent(data.content);
    }, [data.content])

    useEffect(() => {
    }, [data.date])


    const loadNote = () => {
        document.getElementById(data.id).classList.add("selected");
        navigate(`${data.index}/`)
    }


    return (
        <div className="new-note" id={data.id} onClick={loadNote}>
            <div className='note-title'>
                <h3>{data.title}</h3>
                <h4>{new Date(data.date).toLocaleString()}</h4>
            </div>
            <div className='note-content' dangerouslySetInnerHTML={{__html: content}}>
                
            </div>
        </div>
    );
}

export default Note