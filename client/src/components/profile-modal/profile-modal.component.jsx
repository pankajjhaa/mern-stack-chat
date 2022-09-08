import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";


export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center'
};

const ProfileModal = ({isOpen, handleClose, user}) => {
    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{mx: 3, width: '100px', height: '100px', borderRadius: "50%"}} component="img" src={user?.image} />
                    <Box>
                        <Typography>{user?.name.toUpperCase()}</Typography>
                        <Typography>{user?.email}</Typography>
                    </Box>

                </Box>
            </Modal>
        </>
    )
}

export default ProfileModal
