import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {style} from "../profile-modal/profile-modal.component.jsx";
import {useSelector} from "react-redux";

const GroupChatModal = ({isOpen, handleClose, user}) => {
    const {selectedChat} = useSelector((state) => state.persistedReducer.selectedChat)

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box>
                        <Typography>{selectedChat?.chatName}</Typography>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default GroupChatModal
