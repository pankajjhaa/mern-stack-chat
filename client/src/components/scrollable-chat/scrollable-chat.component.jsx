import {useEffect, useRef} from "react";
import {Avatar, Box, Tooltip} from "@mui/material";
import {useSelector} from "react-redux";
import Typography from "@mui/material/Typography";

const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
};

const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};

const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 2;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};


export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

const ScrollableChat = ({messages}) => {
    const chatSelected = useSelector((state) => state.persistedReducer.selectedChat.selectedChat)
    const {userInfo} = useSelector((state) => state.persistedReducer.user)

    const user = JSON.parse(userInfo)

    const messageEndRef = useRef(null)
    useEffect(() => {
        messageEndRef.current?.scrollIntoView()
    }, [messages])
    return (
        <>
            {messages && messages.map((m, i) => (
                <>
                    <Box sx={{display: 'flex'}} component="div">
                        {(isSameSender(messages, m, i, user._id)
                                || isLastMessage(messages, m, user._id))
                            &&
                            (
                                <Tooltip title={m.sender?.name}>
                                    <Avatar
                                        sx={{mt: "7px", mr: 1, size: "sm", cursor: "pointer"}}
                                        name={m.sender.name}
                                        src={m.sender.image}
                                    />

                                </Tooltip>
                            )}

                        <Box component="span" sx={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i) ? 1 : 3
                        }}>
                           <Typography>
                               {m.content}
                           </Typography>
                        </Box>
                    </Box>
                </>
            ))}
            <Box ref={messageEndRef}/>
        </>
    )
}

export default ScrollableChat
