import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Home from "./components/Home";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";

function App() {
  const [alert,setAlert]=useState(null);
  const showAlert=(message,type)=>{
    setAlert({
      msg:message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar></Navbar>
          <Alert alert={alert}></Alert>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert}></Home>}></Route>
              <Route exact path="/about" element={<About></About>}></Route>
              <Route exact path="/login" element={<Login showAlert={showAlert}></Login>}></Route>
              <Route exact path="/signup" element={<Signup showAlert={showAlert}></Signup>}></Route>
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
