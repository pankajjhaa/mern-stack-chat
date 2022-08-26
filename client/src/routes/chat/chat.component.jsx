import {Box, Paper} from "@mui/material";
import {useSelector} from "react-redux";
import ChatSideBar from "../../components/chat-sidebar/chat-sidebar.component.jsx";
import ChatContent from "../../components/chat-content/chat-content.component.jsx";
import Header from "../../components/header/header.component.jsx";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";


const Chat = () => {
    const user = useSelector((state) => state.persistedReducer.user.userInfo)

    return (
        <>
            <Header/>

            <Box sx={{width: '100%'}} component="div">
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "91.5vh",
                    padding: "10px"
                }}>
                    {user && <ChatSideBar/>}
                    {user && <ChatContent/>}
                </Box>
            </Box>

        </>

    )
}

export default Chat
