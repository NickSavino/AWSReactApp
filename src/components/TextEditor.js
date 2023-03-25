import { getNodeText } from '@testing-library/react';
import { wait } from '@testing-library/user-event/dist/utils';
import { Profiler, useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useOutletContext, useParams, useLocation } from 'react-router-dom';

import Note from './Note';

import './TextEditor.css'

function TextEditor() {
  
  const navigate = useNavigate();
  const noteIndex = useParams()["index"];

  const location = useLocation();
  //note list

  const [notes, setNotes] = useOutletContext();
  // const [currentNote, setCurrentNote] = useState({});

  //user and profile data
  const [logOut, user, profile, setProfile, currentNote] = useOutletContext();

  //note parameters
  const [title, setTitle] = useState(currentNote.title);
  const [date, setDate] = useState("");
  const [content, setContent] = useState(currentNote.content);

  useEffect(() => {
    
    if (currentNote !== undefined) {
      setTitle(currentNote.props.noteData.title);
      setContent(currentNote.props.noteData.content);
      let newDate = formatDate(currentNote.props.noteData.date);
      setDate(newDate);
    }

    
      
  }, [location])



  const formatDate = (date) => {
    //sets date to current date and time
    //returns date in a readable format
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    let newDate = new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
    if (newDate == "Invalid Date") {
        return "";
    }
    const formatted = newDate.toISOString('en-us', options).slice(0, 19)

    return formatted;
  };
  
  const saveNote = () => {
    //saves note to local storage

    //fetches note from notes list based on current params selection
   
    console.log(currentNote);
    //updates note data
    currentNote.props.noteData.title = title;
    currentNote.props.noteData.date = date;
    currentNote.props.noteData.content = content;

    //updates note list with new note data
    notes[noteIndex - 1] = currentNote;

    //saves note list to local storage and updates state
    //window.localStorage.setItem("Notes", JSON.stringify(notes))
    //setNotes(notes);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: currentNote.props.noteData.id,
        title: title,
        date: date,
        content: content,
        index: noteIndex,
      }),
    }

      
    console.log("Email in texteditor: " + profile.email);
    console.log("Token in texteditor: " + user);
    fetch("https://5q4vabw7xtv2cn7t5djmy23ocy0sqepv.lambda-url.ca-central-1.on.aws/?email=" + profile.email, options)
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

    //returns to note list and viewer
    const newNotes = [...new Set(notes)];
    setNotes(newNotes);
    navigate("../")
  }

  const confirmDelete = () => {
    //confirms if user wants to delete note
    const answer = window.confirm("Are you sure?");
    if (answer) {
      deleteNote();
    }
  };

  const deleteNote = () => {

    //deletes note from database
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: currentNote.id,
      }),
    }

    fetch("https://dfgetdoztkln3oismrmapfb5lm0rnoow.lambda-url.ca-central-1.on.aws/?email=" + profile.email, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success");
      console.log(data);
    })
    .catch(error => console.log(error));



    //deletes note from local storage
    // const new_notes = notes.pop(noteIndex - 1);
    // setNotes(new_notes);
    // window.localStorage.setItem("Notes", JSON.stringify(notes));
    setNotes(notes.filter((note) => note.props.noteData.id !== currentNote.id))
    navigate("/notes");
  }

  const handleTitle = (input) => {
    //disables default value for title
    input.defaultPrevented = true;
    setTitle(input.target.value);
  }

  const handleDate = (input) => {
    //disables default value for date
    input.defaultPrevented = true;
    setDate(input.target.value);
  }

  const handleSubmit = (input) => {
    //Prevents form submissions which will break the page
    if (input.keyCode === 13) {
      input.preventDefault();
    }
  }

    return (
      <div className='note-editor'>
        
        <div className='note-title'>
          <form onSubmit={handleSubmit}>
              <input id='title' type='text' placeholder={title} onChange={handleTitle} onKeyDown={handleSubmit}/>
              <input id='time' type="datetime-local" onChange={handleDate} defaultValue={date}/>
          </form>
          
          <div className='manage-note'>
              <button className='save-note' onClick={saveNote}>Save</button>
              <button className='delete-note' onClick={confirmDelete}>Delete</button>
          </div>
        </div>

        <ReactQuill theme="snow" value={content} onChange={setContent} placeholder={"Your Note Here..."}/>

      </div>
    );
    
  }

export default TextEditor