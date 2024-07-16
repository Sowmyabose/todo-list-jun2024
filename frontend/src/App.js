import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from './components/Todo';

function App() {
  const headStyle = {
    textAlign: "center",
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://play-lh.googleusercontent.com/vTTDlsM4RpyT0f3xn5oky7Nw22SISKIXkDA0Yz20racoMLDzaZjcOivbx1lEsjZQZNE=w526-h296-rw")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
  };

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
  };

  return (
    <div style={backgroundStyle}>
      <div style={containerStyle}>
        <h1 style={headStyle}>To-do List With Notifications </h1>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Todo />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;