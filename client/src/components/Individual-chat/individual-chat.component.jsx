import {useDispatch, useSelector} from "react-redux";
import {Box, CircularProgress, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import WestIcon from '@mui/icons-material/West';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProfileModal from "../profile-modal/profile-modal.component";
import {useEffect, useState} from "react";
import GroupChatModal from "../group-chat-modal/group-chat-modal.component";
import TextField from "@mui/material/TextField";
import {useFetchMessageQuery, useSendMessageMutation} from "../../features/chat/chat.api.js";
import {toast} from "react-toastify";
import ScrollableChat from "../scrollable-chat/scrollable-chat.component.jsx";
import io from "socket.io-client";
import {fetchChatAgain} from "../../features/chat/chat.slice.js";

const ENDPOINT = "http://localhost:5000"
let socket, selectedChatCompare;

const IndividualChat = () => {

    const {fetchAgain, selectedChat} = useSelector((state) => state.persistedReducer.selectedChat)
    const {userInfo} = useSelector((state) => state.persistedReducer.user)
    const [open, setOpen] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const [messageSend] = useSendMessageMutation()
    const {data = [], isLoading, error} = useFetchMessageQuery(selectedChat?._id)
    const resp = useFetchMessageQuery(selectedChat?._id)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState( isLoading ?? false)
    const dispatch = useDispatch()

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };

    function getSender(loggedUser_, users) {
        return users[0]._id === loggedUser_?._id ? users[1]?.name : users[0]?.name
    }

    function getSenderFull(loggedUser_, users) {
        return users[0]._id === loggedUser_?._id ? users[1] : users[0]
    }


    useEffect(() => {

        socket = io(ENDPOINT);
        socket.emit("setup", JSON.parse(userInfo));
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => {
            console.log('is typing', isTyping)
            setIsTyping(true)
            console.log('is typing 2', isTyping)
        });
        socket.on("stop typing", () => setIsTyping(false));


        // eslint-disable-next-line
    }, [typing]);

    useEffect(() => {
        if (!isLoading) setMessages(data)
        selectedChatCompare = selectedChat;
    }, [selectedChat, resp]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // if (!notification.includes(newMessageReceived)) {
                //     setNotification([newMessageReceived, ...notification]);
                //     setFetchAgain(!fetchAgain);
                // }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            event.preventDefault();
            socket.emit('stop typing', selectedChat._id)
            setLoading(true)
            const data = {
                content: newMessage,
                chatId: selectedChat._id
            }

            await messageSend(data).unwrap().then((payload) => {
                socket.emit("new message", payload);
                setMessages([...messages, payload]);
                setNewMessage("");
                setLoading(false)
            })
                .catch((error) => {
                    toast.error(error.data)
                    setLoading(false)
                });

        }
    }

    function typingHandler(e) {
        setNewMessage(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            console.log('emit')
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);

    }

    return (
        <>
            {
                selectedChat ? (
                    <>

                        <Typography sx={{
                            fontSize: {xs: "28px", md: "30px"},
                            pb: 3,
                            px: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: {xs: "space-between"},
                            alignItems: 'center'
                        }}>
                            <WestIcon sx={{display: {xs: 'flex', md: 'none'}}}/>
                            {!selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(JSON.parse(userInfo), selectedChat.users).toUpperCase()}
                                        <VisibilityIcon onClick={handleOpen} sx={{cursor: 'pointer'}}/>
                                        <ProfileModal user={getSenderFull(JSON.parse(userInfo), selectedChat.users)}
                                                      isOpen={open} handleClose={handleClose}/>

                                    </>
                                ) :
                                (<>
                                    {selectedChat.chatName.toUpperCase()}
                                    <VisibilityIcon onClick={handleOpen} sx={{cursor: 'pointer'}}/>
                                    <GroupChatModal user={getSenderFull(JSON.parse(userInfo), selectedChat.users)}
                                                    isOpen={open} handleClose={handleClose}/>
                                </>)


                            }
                        < /Typography>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: "5px",
                            backgroundColor: "#E8E8E8",
                            width: '100%',
                            height: "100%",
                            borderRadius: '10px',
                            overflowY: 'hidden'
                        }}>

                            {isLoading ? (
                                <CircularProgress sx={{
                                    size: "xl",
                                    width: 20,
                                    height: 20,
                                    alignSelf: "center",
                                    margin: "auto"
                                }}/>
                            ) : (
                                <>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        overflowY: "scroll",
                                        scrollBarWidth: "none"
                                    }}>
                                        <ScrollableChat messages={messages}/>
                                    </Box>
                                </>
                            )}

                            <Box component="form" onKeyDown={sendMessage} noValidate sx={{mt: 1}}>
                                {isTyping ? <Typography>Loading ...</Typography> : ''}
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    sx={{backgroundColor: "#E0E0E0"}}
                                    onChange={typingHandler}
                                    value={newMessage}
                                    label="Enter a message..."
                                    id="message"
                                />
                            </Box>

                        </Box>
                    </>
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "center", height: "100%"}}>
                        <Typography sx={{fontsize: "30px",}}>
                            Click on user to chat
                        </Typography>
                    </Box>
                )
            }
        </>
    )
}

export default IndividualChat
