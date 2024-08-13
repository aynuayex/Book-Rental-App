import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh");
    const {id, email, fullName, role, accessToken} = response.data;
    
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data);
      return { ...prev, id, email, fullName, role, accessToken };
    });

    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
