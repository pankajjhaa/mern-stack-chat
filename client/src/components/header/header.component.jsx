import AppBar from '@mui/material/AppBar';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import {removeUser, setUser} from "../../features/user/user.slice.js";
import {SearchIconWrapper, style, StyledInputBase, Search} from "../../assets/search-box/search-box.component.jsx";
import ChatLoadingComponent from "../chat-loading/chat-loading.component.jsx";
import {useGetSearchUserQuery} from "../../features/user/user.api.js";
import {useAccessChatsMutation} from "../../features/chat/chat.api.js";
import {toast} from "react-toastify";
import {selectedChat} from "../../features/chat/chat.slice.js";


const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [searchModal, setSearchModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState(null);
    const {userInfo} = useSelector((state) => {
        console.log("userState", state.persistedReducer)
        return state.persistedReducer.user
    })
    const {data = [], isLoading, error} = useGetSearchUserQuery(search === '' ? null : search);
    const [accessChat] = useAccessChatsMutation();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const user = JSON.parse(userInfo)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenSearchModal = (event) => {
        setSearchModal(true);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    function handleLogout() {
        localStorage.removeItem('user')
        dispatch(removeUser())
        navigate("/")
    }

    const handleSearchModalClose = () => setSearchModal(false);

    function handleSearch(e) {
        setSearch(e.target.value);
    }

    const accessChatHandler = async (userId) => {
        setLoading(true)
        const data = {
            userId
        }
        await accessChat(data).unwrap().then((payload) => {
            setLoading(false)
            dispatch(selectedChat(payload))
            setSearchModal(false)
        })
            .catch((error) => {
                toast.error(error.data.message)
                setLoading(false)
            });
    }


    return (

        <>
            <AppBar position="static" sx={{margin: 0}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon/>
                                </SearchIconWrapper>

                                <Tooltip title={"Search user for chat"}>
                                    <StyledInputBase
                                        // onChange={(e) => handleSearch(e)}
                                        onClick={handleOpenSearchModal}
                                        placeholder="Search user"
                                        inputProps={{'aria-label': 'search'}}
                                    />
                                </Tooltip>

                            </Search>
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt={user?.name} name={user?.name} src={user?.image}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Button sx={{p: 0, color: "black"}} onClick={handleOpen}>Profile</Button>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Button onClick={handleLogout} sx={{p: 0, color: "black"}}>Logout</Button>
                                </MenuItem>

                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Modal>

            <Modal
                open={searchModal}
                onClose={handleSearchModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{flexGrow: 1, flexDirection: 'column', display: {xs: 'none', md: 'flex'}}}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>

                            <Tooltip title={"Search user for chat"}>
                                <StyledInputBase
                                    onChange={(e) => handleSearch(e)}
                                    placeholder="Search user"
                                    inputProps={{'aria-label': 'search'}}
                                />
                            </Tooltip>

                        </Search>

                        {isLoading ? <ChatLoadingComponent/> :
                            <>
                                {data.map(user => {
                                    return (
                                        <Box key={user._id}>
                                            <Typography
                                                onClick={() => accessChatHandler(user._id)}>{user.name}</Typography>
                                        </Box>
                                    )
                                })}
                            </>
                        }
                    </Box>
                </Box>
            </Modal>

        </>

    )
}

export default Header
