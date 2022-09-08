import {Box} from "@mui/material";
import {useSelector} from "react-redux";
import IndividualChat from "../Individual-chat/individual-chat.component.jsx";

const ChatContent = () => {
    const chatSelected = useSelector((state) => state.persistedReducer.selectedChat.selectedChat)


    return (
        <Box sx={{
            display: {xs: chatSelected ? "flex" : "none", md: 'flex'},
            alignItems: 'center',
            flexDirection: 'column',
            p: 3,
            backgroundColor: 'white',
            width: {xs: "100%", md: '68%'},
            borderRadius: "10px",
            borderWidth: "1px"
        }}>
            <IndividualChat />
        </Box>
    )
}

export default ChatContent
