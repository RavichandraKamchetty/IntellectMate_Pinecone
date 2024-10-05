import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const setScreen = useSetRecoilState(authScreenAtom)
    const showToast = useShowToast();

    const logout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            localStorage.removeItem("user-info");

            setScreen("login");
            setUser(null);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        }
    };

    return logout;
};

export default useLogout;
