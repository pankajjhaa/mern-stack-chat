import {useGetAllChatsQuery} from "../../features/chat/chat.api.js";
import {Box, Stack} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChatLoading from "../chat-loading/chat-loading.component.jsx";
import {selectedChat} from "../../features/chat/chat.slice.js";
import {useEffect, useState} from "react";


const ChatSideBar = () => {
    const {data = [], isLoading, error} = useGetAllChatsQuery()
    const dispatch = useDispatch()
    const [loggedUser, setLoggedUser] = useState()
    const chatSelected = useSelector((state) => state.persistedReducer.selectedChat.selectedChat)

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    function getSender(loggedUser_, users) {
        return users[0]._id === loggedUser_._id ? users[1].name : users[0].name
    }

    return (
        <>
            <Box sx={{
                display: {
                    sx: chatSelected ? 'none' : "flex",
                    md: 'flex'
                },
                flexDirection: 'column',
                p: 3,
                background: "white",
                width: {xs: '100%', md: "31%"},
                borderRadius: "50px",
                borderWidth: "1px"
            }}>
                <Box sx={{
                    pb: 3,
                    px: 3,
                    fontSize: {xs: "28px", md: '30px'},
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography>
                        Chats
                    </Typography>
                    <Button variant="contained" sx={{display: 'flex'}}>
                        New group chat
                    </Button>
                </Box>


                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    background: '#E8E8E8',
                    width: "100%",
                    height: "100%",
                    borderRadius: "50px",
                    overflowY: "hidden"
                }}>
                    {data.length > 0 ? (
                        <>
                            <Stack sx={{overFlowY: "scroll"}}>
                                {data.map((chat) =>
                                    <Box key={chat._id} onClick={() => dispatch(selectedChat(chat))}
                                         sx={{
                                             cursor: "pointer",
                                             background: (chatSelected === chat) ? "#38B2AC" : "#E8E8E8",
                                             color: (chatSelected === chat) ? "white" : "black",
                                             px: 3,
                                             py: 2
                                         }}>
                                        <Typography>
                                            {!chat.isGroupChat ? (
                                                getSender(loggedUser, chat.users)
                                            ) : chat.chatName}
                                        </Typography>
                                    </Box>
                                )}

                            < /Stack>
                        </>
                    ) : (
                        <ChatLoading/>
                    )}
                </Box>
            </Box>

        </>

    )
}

export default ChatSideBar
