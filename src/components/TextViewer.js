import { useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';


import './TextViewer.css'
import { wait } from '@testing-library/user-event/dist/utils';


function TextViewer() {

  const navigate = useNavigate();
  const noteIndex = useParams()["index"];
  
  const [notes, setNotes] = useOutletContext();
  const [currentNote, setCurrentNote] = useState({});
  const [selectedNote, setSelectedNote] = useState({});

  //user and profile data
  const [logOut, user, profile, setProfile] = useOutletContext();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");


  useEffect(() => {
    //initial load
    if (notes === []) {
      navigate("../");
    }
  }, [])

  useEffect(() => {
    //updates title on load
      
    if (currentNote === {} && notes.length !== 0) {
      notes.forEach((note) => {
          console.log(note.props.index)
          console.log(noteIndex)
          if (note.props.index === noteIndex) {
              console.log(note)
              setCurrentNote(note);
              console.log(currentNote)
              return;
          }
      })
    }

    console.log(notes)
    console.log(currentNote)
    const noteToSelect = notes.find((note) => {
      console.log(note)
      console.log(note.props.index)
      console.log(noteIndex)
      return note.props.index == noteIndex;
    });
   
    console.log(noteToSelect)
    
    

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    if (noteToSelect) {
      setCurrentNote(noteToSelect);
      console.log(currentNote)
      setTitle(noteToSelect.props.noteData.title);
      const datetime = new Date(noteToSelect.props.noteData.date).toLocaleString("en-US", options);
      
      setDate(datetime);
      setContent(noteToSelect.props.noteData.content);
      setSelectedNote(noteToSelect);
    }
      
   
    
    
  }, [currentNote, notes, noteIndex])

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

    const noteToSelect = notes.find((note) => note.props.index === noteIndex);
    if (noteToSelect) {
      setCurrentNote(noteToSelect);
      console.log(currentNote)
    }
    //deletes note from database
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify({
        id: currentNote.props.noteData.id,
      }),
    }

    fetch("https://dfgetdoztkln3oismrmapfb5lm0rnoow.lambda-url.ca-central-1.on.aws/?email=" + profile.email, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json()
    })
    .then((data) => {
      console.log("Success");
      console.log(data);
    })
    .catch(error => console.log(error));
    const new_notes = notes.filter((note) => note.props.noteData.id !== currentNote.id)
    setNotes(new_notes)
    navigate("/notes")
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