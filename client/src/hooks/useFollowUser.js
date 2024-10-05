import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";

const useFollowUser = (user) => {
    const authUser = useRecoilValue(userAtom);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (user && user.followers) {
            setIsFollowing(user.followers.includes(authUser?._id));
        }
    }, [user, authUser]);

    const showToast = useShowToast();

    const handleFollowUnfollow = async () => {
        if (!authUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        if (isUpdating) return;

        setIsUpdating(true);

        try {
            const res = await fetch(`/api/users/follow/${user?._id}`, {
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
            if (isFollowing) {
                showToast("Success", `Unfollowed ${user?.username}`, "success");
                user.followers.pop();
            } else {
                showToast("Success", `Followed ${user?.username}`, "success");
                user.followers.push(authUser?._id);
            }

            setIsFollowing(!isFollowing);

        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsUpdating(false);
        }
    };

    return { handleFollowUnfollow, isFollowing, isUpdating };
};

export default useFollowUser;
