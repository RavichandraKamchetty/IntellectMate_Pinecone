import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import postsAtom from "../atoms/postsAtom";
import suggestedUserAtom from "../atoms/suggestedUserAtom";

const useFollowOrUnfollow = (user) => {
    const authUser = useRecoilValue(userAtom);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [suggestedUsers, setSuggestedUsers] =
        useRecoilState(suggestedUserAtom);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        if (user && user.followers) {
            setFollowers(user.followers);
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
            let updatedFollowers = [...followers];

            if (isFollowing) {
                showToast("Success", `Unfollowed ${user?.username}`, "success");
                updatedFollowers = updatedFollowers.filter(
                    (follower) => follower !== authUser?._id
                );
            } else {
                showToast("Success", `Followed ${user?.username}`, "success");
                updatedFollowers.push(authUser?._id);
            }

            setFollowers(updatedFollowers);
            setIsFollowing(!isFollowing);

            const updatedFeed = await fetch("/api/posts/feed");
            const updatedData = await updatedFeed.json();
            setPosts(updatedData);

            const updatedSuggested = await fetch("/api/users/suggested");
            const updatedSuggestedData = await updatedSuggested.json();
            setSuggestedUsers(updatedSuggestedData);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsUpdating(false);
        }
    };

    return { handleFollowUnfollow, isFollowing, isUpdating };
};

export default useFollowOrUnfollow;
