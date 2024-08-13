import axios from "@/api/axios";
import useAuth from "./useAuth";

const useLogOut = () => {
    // const {setAuth} = useAuth();

    const logOut = async () => {
        // setAuth({});
        try {
            const response = await axios.get('/logout');   
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

  return logOut
}

export default useLogOut