import { Box, Flex, VStack, Image, Text } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";
import GoogleAuth from "./GoogleAuth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom";

const AuthForm = () => {

    const authScreenState = useRecoilValue(authScreenAtom);
    console.log(authScreenState);

    const setAuthScreen = useSetRecoilState(authScreenAtom);

    const handleAuthState = () => {
        if (authScreenState === "login") setAuthScreen("signup");
        else setAuthScreen("login");
    };

    return (
        <>
            <Box border={"1px solid gray"} padding={5} borderRadius={4}>
                <VStack spacing={4}>
                    <Image
                        src="/intellect.png"
                        w={300}
                        h={24}
                        cursor={"pointer"}
                        alt="IntellectMate"
                    />
                    {authScreenState === "login" ? <Login /> : <Signup />}

                    {/* ---------------- OR ----------------- */}
                    <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        my={4}
                        gap={1}
                        w={"full"}
                    >
                        <Box flex={2} h={"1px"} bg={"gray.400"} />
                        <Text mx={1} color={"white"}>
                            OR
                        </Text>
                        <Box flex={2} h={"1px"} bg={"gray.400"} />
                    </Flex>

                    {/* Login with google */}
                    <GoogleAuth
                        prefix={
                            authScreenState === "login" ? "Log in" : "Sign up"
                        }
                    />
                </VStack>
            </Box>

            {/* Switch between Login and Signup */}
            <Box border={"1px solid gray"} borderRadius={4} padding={5}>
                <Flex alignItems={"center"} justifyContent={"center"}>
                    <Box mx={2} fontSize={14}>
                        {authScreenState === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </Box>
                    <Box
                        onClick={handleAuthState}
                        color={"blue.500"}
                        cursor={"pointer"}
                    >
                        {authScreenState === "login" ? "Sign up" : "Log in"}
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default AuthForm;
