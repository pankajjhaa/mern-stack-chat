import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useLoginMutation} from "../../features/auth/auth.api.js";
import {toast} from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import {useDispatch} from "react-redux";
import {setUser} from "../../features/user/user.slice.js";


const theme = createTheme();

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [login] = useLoginMutation()
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        const data = new FormData(event.currentTarget);
        let email = data.get('email')
        let password = data.get('password')

        let user = {
            email: email,
            password: password
        }

        await login(user).unwrap().then((payload) => {
            setLoading(false)
            localStorage.setItem('user', JSON.stringify(payload))
            navigate("/chats");
            const userInfo = localStorage.getItem('user')
            dispatch(setUser(userInfo))
            toast.success("Login success")
        })
            .catch((error) => {
                toast.error(error.data)
                setLoading(false)
            });


    };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" >
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
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={email}
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
                            value={password}
                            autoComplete="current-password"
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
                            Sign In
                        </LoadingButton>


                    </Box>

                </Box>

                <Box>
                    <Button
                        type="text"
                        fullWidth
                        variant="contained"
                        sx={{mb: 3}}
                        onClick={() => {
                            setEmail("pooja@gmail.com")
                            setPassword("12345678")
                        }}
                    >
                        Get guest user credential
                    </Button>
                </Box>


                <Grid container>

                    <Grid item>
                        <Link to={'sign-up'} variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>


            </Container>
        </ThemeProvider>
    );
}
