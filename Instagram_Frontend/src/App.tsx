import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Start from './pages/Start';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#262626',
    },
    secondary: {
      main: '#0095f6',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 