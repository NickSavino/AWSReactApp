import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useOutletContext, useParams, useLocation, parsePath } from 'react-router-dom';

import uuid4 from 'uuid4';

import axios from 'axios';

import Button from '../components/Button';
import Note from '../components/Note';

import './Notes.css'
import '../components/NoteNavigator.css'

function Notes() {

    const navigate = useNavigate();

    const noteIndex = useParams()["index"];

    const location = useLocation();

    const [login, logOut, user, profile, setProfile] = useOutletContext();

    const [notes, setNotes] = useState([]);

    const [display, setDisplay] = useState();

    if (window.localStorage.getItem("Notes") === null && notes.length === 0) {
        
        window.localStorage.setItem("Notes", JSON.stringify(notes));
    }

   

    const [currentNote, setCurrentNote] = useState({});

    useEffect(() => {
        //keeps track of current note
        if (noteIndex !== undefined && notes.length !== 0) {
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
        

    }, [noteIndex, notes])

    useEffect(() => {
        //updates note list when notes are added or deleted

        

        const getOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                
            },
        }
        console.log(profile.email)
        if (profile.email === undefined) {
            logOut();
            return;
        }
        const url = 'https://i5bqqkwm67werh35y5fydyphce0ekbau.lambda-url.ca-central-1.on.aws/?email=' + profile.email;
        fetch(url, getOptions)
        .then(res =>  res.json())
        .then(data => {
            console.log("data:" + JSON.stringify(data.notes))
            let new_notes = data.notes;
            console.log("new_notes:" + new_notes)
            const updated_notes =  new_notes.map((noteData, index) => {
                console.log(noteData);
                return <Note index = {noteData.index} key={noteData.id} noteData={noteData}></Note>
                })
            console.log(updated_notes)
            setNotes(updated_notes)
            console.log("notes:" + notes)
        })
        .catch(err => console.log(err));
        
        
        console.log(notes)

        if (profile === []) {
            logOut();
        }

        if (notes.at(noteIndex) === undefined) {
            navigate("/notes");
        }

    }, [])

    useEffect(() => {
        //displays 'No Notes Yet if notes is null
        
        if (notes === [] || notes.length === 0) {
            setDisplay(<div id="empty-notes"><h3>No Notes Yet</h3></div>)
        }
        else {
            setDisplay(notes)
        }
    }, [notes, noteIndex, currentNote])


  

    const addNote = () => {
        //adds note to notes array. does not store in local storage

        const noteData = {
            id: uuid4(),
            title: "New Note",
            date: new Date(),
            content: "",
            index: notes.length + 1,
        }

        //returns if note isn't saved
        if (location.pathname === `/notes/${noteIndex}/edit`) {
 
            if (notes.at(noteIndex) === undefined) {
                window.alert("Please save your note before adding a new one.");
                return;
            }
        }
        console.log(currentNote)
        notes.forEach((note) => {
            console.log(note.props.index)
            console.log(noteData.index)
            if (note.props.index == noteData.index) {
                console.log("MATCH MUST UPDATE")
                noteData.index += 1;
            }
        })

        const new_note = <Note index = {noteData.index} key={noteData.id} noteData={noteData}></Note>
        setCurrentNote(new_note);
        console.log(currentNote)
        //console.log(notes)
        setNotes([
            ...notes,
            new_note
          ]);
        
          
        navigate(`${new_note.props.index}/edit`);

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
                <Outlet context={[
                    notes, setNotes,
                    profile,
                    user,
                    currentNote
                ]}>
                </Outlet>
            </div>
            
            
        </div>
    );
}

export default Notes;