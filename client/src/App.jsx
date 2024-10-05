import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage";
import Homepage from "./pages/Homepage/Homepage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ChatPage from "./pages/ChatPage/ChatPage";

const App = () => {
    const authUser = useRecoilValue(userAtom);

    return (
        <PageLayout>
            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? <Homepage /> : <Navigate to={"/auth"} />
                    }
                />
                <Route
                    path="/auth"
                    element={!authUser ? <AuthPage /> : <Navigate to={"/"} />}
                />
                <Route path="/:username" element={<ProfilePage />} />
                <Route
                    path="/chat"
                    element={
                        authUser ? <ChatPage /> : <Navigate to={"/auth"} />
                    }
                />
            </Routes>
        </PageLayout>
    );
};

export default App;
