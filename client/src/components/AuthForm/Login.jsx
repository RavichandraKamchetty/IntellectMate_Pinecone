import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            localStorage.setItem("user-info", JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Input
                placeholder="Email"
                type="email"
                fontSize={14}
                value={inputs.email}
                onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                }
                isRequired
            />
            <Input
                placeholder="Password"
                type="password"
                fontSize={14}
                value={inputs.password}
                onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                }
                isRequired
            />

            <Button
                size={"sm"}
                w={"full"}
                colorScheme="blue"
                fontSize={14}
                loadingText="Logging in"
                isLoading={isLoading}
                onClick={handleLogin}
            >
                Log in
            </Button>
        </>
    );
};

export default Login;
