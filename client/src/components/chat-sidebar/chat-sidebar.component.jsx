import {useCreateGroupChatMutation, useGetAllChatsQuery} from "../../features/chat/chat.api.js";
import {Box, Stack} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChatLoading from "../chat-loading/chat-loading.component.jsx";
import {selectedChat} from "../../features/chat/chat.slice.js";
import {useEffect, useState} from "react";
import {style} from "../../assets/search-box/search-box.component.jsx";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {Autocomplete} from "@mui/lab";
import {useGetSearchUserQuery} from "../../features/user/user.api.js";
import {toast} from "react-toastify";

export function getSender(loggedUser_, users) {
    return users[0]._id === loggedUser_?._id ? users[1]?.name : users[0]?.name
}


const ChatSideBar = () => {
    const {data = []} = useGetAllChatsQuery()
    const dispatch = useDispatch()
    const [loggedUser, setLoggedUser] = useState()
    const [loading, setLoading] = useState(false)
    const [groupChatModalOpen, setGroupChatModalOpen] = useState(false)
    const chatSelected = useSelector((state) => state.persistedReducer.selectedChat.selectedChat)
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const {data: userData = [], isLoading: isUserLoading, error: userError} = useGetSearchUserQuery(null)
    const [createGroupChat]= useCreateGroupChatMutation()
    const handleGroupChatModalClose = () => setGroupChatModalOpen(false)
    const handleOpenGroupChatModal = () => setGroupChatModalOpen(true)

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('user')))
    }, [])

    const handleSubmitGroupChat = async (event) => {
        event.preventDefault();
        setLoading(true)
        const data = new FormData(event.currentTarget);

        if(!data.get('name')){
            toast.error("Please enter group name")
        }

        const body = {
            "name" : data.get('name'),
            "users": JSON.stringify(selectedUsers)
        }


        createGroupChat(body).unwrap().then((payload) => {
            setLoading(false)
            toast.success("Group chat created")
            setGroupChatModalOpen(false)
        })
            .catch((error) => {
                toast.error(error.data)
                setLoading(false)
                setGroupChatModalOpen(false)
            });
    }

    return (
        <>
            <Box sx={{
                display: {
                    xs: chatSelected ? 'none' : "flex",
                    md: 'flex'
                },
                mr:3,
                flexDirection: 'column',
                p: 3,
                background: "white",
                width: {xs: '100%', md: "31%"},
                borderRadius: "10px",
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
                    <Button onClick={handleOpenGroupChatModal} variant="contained" sx={{display: 'flex'}}>
                        New group chat
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    background: '#F8F8F8',
                    width: "100%",
                    height: "100%",
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
                                             py: 2,
                                             mb: 2,
                                             borderRadius: "10px"
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

                <Modal
                    open={groupChatModalOpen}
                    onClose={handleGroupChatModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{textAlign: 'center', fontSize: '25px', fontWeight: 'bold'}}>
                            Create group chat
                        </Typography>

                        <Box component="form" onSubmit={handleSubmitGroupChat} noValidate sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="group_name"
                                label="Group name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                            />


                            <Autocomplete
                                multiple
                                id="asynchronous-demo "
                                limitTags={2}
                                options={userData}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                onChange={(event, value) => setSelectedUsers(value)}
                                sx={{width: "100%"}}
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                getOptionLabel={(option) => `${option.name}`}
                                renderOption={(props, userData) => (
                                    <Box component="li" {...props} key={userData?._id}>
                                        {userData?.name}
                                    </Box>
                                )}
                                loading={isUserLoading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Add users*"
                                    />
                                )}
                            />


                            <LoadingButton
                                type="submit"
                                fullWidth
                                loading={loading}
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Create
                            </LoadingButton>
                        </Box>
                    </Box>
                </Modal>
            </Box>


        </>

    )
}

export default ChatSideBar
