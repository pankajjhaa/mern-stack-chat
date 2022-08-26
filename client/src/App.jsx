import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./routes/home/home.component.jsx";
import Chat from "./routes/chat/chat.component.jsx";
import SignUp from "./components/signup/signup.component.jsx";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return (

        <>
            <ToastContainer/>
            <div className="App">
                <Routes>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/chats'} element={<Chat/>}/>
                    <Route path={'/sign-up'} element={<SignUp/>}/>
                </Routes>
            </div>
        </>

    )
}

export default App
