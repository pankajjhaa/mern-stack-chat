import Login from "../../components/login/login.component.jsx";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Home = () => {
    const navigate = useNavigate();
    const {userInfo} = useSelector((state) => state.persistedReducer.user)

    useEffect(() => {
        if(userInfo.length > 0){
            navigate("/chats")
        }else{
            navigate("/")
        }
    }, [navigate])


    return (
        <>
            <Login/>
        </>
    )
}

export default Home
