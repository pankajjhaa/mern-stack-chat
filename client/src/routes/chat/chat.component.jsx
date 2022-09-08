import {Box} from "@mui/material";
import {useSelector} from "react-redux";
import ChatSideBar from "../../components/chat-sidebar/chat-sidebar.component.jsx";
import ChatContent from "../../components/chat-content/chat-content.component.jsx";
import Header from "../../components/header/header.component.jsx";


const Chat = () => {
    const user = useSelector((state) => state.persistedReducer.user.userInfo)

    return (
        <>

            <Box component="div" sx={{width: "100%"}}>
                <Header/>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "98%",
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
