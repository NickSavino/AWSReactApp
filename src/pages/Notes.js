import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import uuid4 from 'uuid4';

import axios from 'axios';

import Button from '../components/Button';
import Note from '../components/Note';

import './Notes.css'
import '../components/NoteNavigator.css'

function Notes() {

    

    const navigate = useNavigate();

    const noteIndex = useParams()["index"];

    const [notes, setNotes] = useState([]);

    const [display, setDisplay] = useState();

    if (window.localStorage.getItem("Notes") === null && notes.length === 0) {
        
        window.localStorage.setItem("Notes", JSON.stringify(notes));
    }

    const [currentNote, setCurrentNote] = useState({});

    useEffect(() => {
        //keeps track of current note
        if (noteIndex !== undefined && notes.length !== 0) {
            setCurrentNote(notes[noteIndex - 1].props["noteData"]);

            
        }
        
        

    }, [noteIndex])

    useEffect(() => {
        //updates note list when notes are added or deleted
        const temp_notes = JSON.parse(window.localStorage.getItem("Notes"));
        axios.get('https://sgejw7hxcl2axnzjjdmlmai6ua0wghyw.lambda-url.ca-central-1.on.aws/?email=nicksavino2@gmail.com')
        .then(response => console.log(response.data));
        const updated_notes = [];
        for (const note in temp_notes) {  
            updated_notes.push(<Note key={note} noteData={temp_notes[note].props["noteData"]}></Note>)
        }
        setNotes(updated_notes);
        
    }, [])

    useEffect(() => {
        //displays 'No Notes Yet if notes is null
        if (notes === undefined || notes.length === 0) {
            setDisplay(<div id="empty-notes"><h3>No Notes Yet</h3></div>)
        }
        else {
            setDisplay(notes)
        }
    }, [notes])


    useEffect(() => {
        
        if (noteIndex === undefined) {
            //returns if no note index is selected
            return
        }
        if (JSON.parse(window.localStorage.getItem("Notes"))[noteIndex-1] === undefined) {
            //navigates to home page if note index is null
            navigate("../notes")
        }
    }, [])

    const addNote = () => {
        //adds note to notes array. does not store in local storage
        
        //returns if note isn't saved
        if (JSON.parse(window.localStorage.getItem("Notes")).length !== notes.length) {
            if (JSON.parse(window.localStorage.getItem("Notes"))[noteIndex - 1] === undefined && (notes.length !== 0)) {
                window.alert("Please save your note before adding a new one.");
                return;
            }
        }
        
        const noteData = {
            id: uuid4(),
            title: "New Note",
            date: new Date(),
            content: "",
            index: notes.length + 1,
        }
        
        setCurrentNote(noteData);

        setNotes([
            ...notes,
            <Note key={notes.length} noteData={noteData}></Note>
          ]);
          
          
        navigate(`${noteData.index}/edit`);

    }

    return (
        <div className="notes-container">
            
            <div id="note-navigator">
            <div className='notes-header'>
                <h2 className='note-text'>Notes</h2>
                <Button text={"+"} id={"add-note-button"} onClick={addNote}></Button>
            </div>
            <div className='notes-list'>
                {display}
            </div>

        </div>
            
            <div className='note-header'>    
                <Outlet context={[notes, setNotes]}></Outlet>
            </div>
            
            
        </div>
    );
}

export default Notes;