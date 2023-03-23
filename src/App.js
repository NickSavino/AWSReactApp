import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import NoPage from "./pages/NoPage";
import NoNotes from "./components/NoNotes";
import TextViewer from "./components/TextViewer"
import TextEditor from "./components/TextEditor";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Layout />}>
          <Route path='login' element={<Login />}/>
          <Route path='notes' element={<Notes />}>
            <Route path=':index'>
                <Route index element={<TextViewer/>}/>
                <Route path="edit" element={<TextEditor />}/>
              </Route>
              <Route path="" element={<NoNotes />} />
            </Route>
          
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


