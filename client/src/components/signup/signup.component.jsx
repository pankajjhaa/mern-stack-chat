import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined.js";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from "@mui/material/Grid";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {toast} from "react-toastify";
import {useSignUpMutation} from "../../features/auth/auth.api.js";
import {setUser} from "../../features/user/user.slice.js";
import {useDispatch} from "react-redux";

const theme = createTheme();

const SignUp = () => {
    const dispatch = useDispatch();
    const [image, setImage] = useState("")
    const [loading, setLoading] = useState(false)
    const [signUp] = useSignUpMutation()
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email')
        let password = data.get('password')
        let confirmPassword = data.get('confirm-password')
        let name = data.get('name')

        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast.warning("Please fill all fields")
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            toast.warning("Password and confirm password do not match")
            setLoading(false)
            return
        }

        let user = {
            name: name,
            email: email,
            password: password,
            image: image
        }

        await signUp(user).unwrap().then((payload) => {
            toast.success("Register success")
            setLoading(false)
            localStorage.setItem('user', JSON.stringify(payload))
            const userInfo = localStorage.getItem('user')
            dispatch(setUser(userInfo))
            navigate("/chats");
        })
            .catch((error) => {
                toast.error(error.data.message)
                setLoading(false)
            });



    };


    function uploadImage(image) {
        setLoading(true)
        if (image === undefined) {
            toast.warning("Please upload image")
            setLoading(false)
            return

        }

        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "chat-app-image")
            fetch("https://api.cloudinary.com/v1_1/chat-app-image/image/upload", {
                method: "post",
                body: data
            })
                .then((res) => res.json())
                .then((data) => {
                    setImage(data.url.toString())
                    setLoading(false)
                })
                .catch((err) => {
                    setLoading(false)
                })
        } else {
            toast.warning("Please upload image")
            setLoading(false)
        }

    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-password"
                            label="Confirm Password"
                            type="password"
                            id="confirm-password"
                            autoComplete="confirm-password"
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="image"
                            // label="Image"
                            onChange={(e) => uploadImage(e.target.files[0])}
                            type="file"
                            id="image"
                        />


                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <LoadingButton
                            type="submit"
                            fullWidth
                            loading={loading}
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign Up
                        </LoadingButton>
                        <Grid container>
                            <Grid item>
                                <Link to="/" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default SignUp
