import { useEffect, useState } from "react";
import useShowToast from "./useShowToast.js";
import {useParams} from "react-router-dom"

const useGetUserProfile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const showToast = useShowToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);

                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data)

                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                return;
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, [username, showToast]);

    return { isLoading, user };
};

export default useGetUserProfile;
