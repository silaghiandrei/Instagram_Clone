import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Start from './pages/Start';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import UserPosts from './pages/UserPosts';
import {authService} from './services/authService';

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

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login"/>;
};

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route path="/" element={<Start/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/user" element={<PrivateRoute><User/></PrivateRoute>}/>
                    <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
                    <Route path="/create-post" element={<PrivateRoute><CreatePost/></PrivateRoute>}/>
                    <Route path="/post/:id" element={<PrivateRoute><PostDetail/></PrivateRoute>}/>
                    <Route path="/my-posts" element={<PrivateRoute><UserPosts/></PrivateRoute>}/>
                    <Route path="/" element={<Navigate to="/user"/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App; 