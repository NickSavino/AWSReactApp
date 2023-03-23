import { useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';


import './TextViewer.css'


function TextViewer() {

  const navigate = useNavigate();
  const noteIndex = useParams()["index"];
  
  const [notes, setNotes] = useOutletContext();
  const [currentNote, setCurrentNote] = useState({});

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    //updates title on load
    
      if (currentNote !== undefined && notes.length !== 0) {
        setCurrentNote(notes[noteIndex - 1].props["noteData"]) 
      }

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    setTitle(currentNote.title);
    const datetime = new Date(currentNote.date).toLocaleString("en-US", options);
    
    setDate(datetime);
    setContent(currentNote.content);
    
  }, )

  const editNote = () => {
      navigate("./edit");
  }

  const modules = {
    toolbar: false
  }

  const confirmDelete = () => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      deleteNote();
    }
    
  };

  const deleteNote = () => {
    const new_notes = notes.pop(noteIndex - 1);
    setNotes(new_notes);
    window.localStorage.setItem("Notes", JSON.stringify(notes))
    navigate("/")
  }

    
    return (
      <div className='note-viewer'>
        
        <div className='note-title'>
          <div className='viewer-title'>
              <h1 id='title' type='text'>{title}</h1>
              <h2 id='time'>{date}</h2>
          </div>
          
          <div className='manage-note'>
              <button className='edit-note' onClick={editNote}>Edit</button>
              <button className='delete-note' onClick={confirmDelete}>Delete</button>
          </div>
        </div>

        <ReactQuill theme="snow" value={content} readOnly={true} modules={modules} />

      </div>
    );
    
  }

export default TextViewer