import { getNodeText } from '@testing-library/react';
import { wait } from '@testing-library/user-event/dist/utils';
import { useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import Note from './Note';

import './TextEditor.css'

function TextEditor() {
  
  const navigate = useNavigate();
  const noteIndex = useParams()["index"];

  //note list

  const [notes, setNotes] = useOutletContext();
  const [currentNote, setCurrentNote] = useState({});

  //note parameters
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
     
    if (currentNote !== undefined && notes.length !== 0) {
        setCurrentNote(notes[noteIndex - 1].props["noteData"]) 
      }
      //update elements on refresh
      if (content === undefined || content === "") {
        setContent(currentNote.content)
      }
      if ((title === undefined || title === "") && (date === undefined || date == "")) {
        setTitle(currentNote.title);
        let newDate = formatDate(currentNote.date);
        setDate(newDate);
      }

  }, )



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
    const saved_note = notes.at(noteIndex - 1);
    
    //updates note data
    saved_note.props.noteData.title = title;
    saved_note.props.noteData.date = date;
    saved_note.props.noteData.content = content;

    //updates note list with new note data
    notes[noteIndex - 1] = saved_note;

    //saves note list to local storage and updates state
    window.localStorage.setItem("Notes", JSON.stringify(notes))
    setNotes(notes);

    //returns to note list and viewer
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
    //deletes note from local storage
    const new_notes = notes.pop(noteIndex - 1);
    setNotes(new_notes);
    window.localStorage.setItem("Notes", JSON.stringify(notes));
    navigate("/");
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