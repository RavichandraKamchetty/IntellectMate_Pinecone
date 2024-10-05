import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const useGetUserPosts = () => {
    const showToast = useShowToast();
    const { username } = useParams();
    const [fetchingPosts, setFetchingPosts] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);

    useEffect(() => {
        const getPosts = async () => {
            setFetchingPosts(true);

            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

                if (Array.isArray(data)) {
                    setPosts(data);
                    console.log("data: ", data);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
                return;
            } finally {
                setFetchingPosts(false);
            }
        };
        getPosts();
    }, [username, showToast, setPosts]);

    return { fetchingPosts, posts, setPosts };
};

export default useGetUserPosts;
