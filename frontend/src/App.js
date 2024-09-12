import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" component={Home} exact />
        <Route path="/opportunities" component={Opportunities} />
        <Route path="/profile" component={Profile} />
      </Routes>
    </Router>
  );
}

export default App;

