import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Container,
    Flex,
    Input,
    InputGroup,
    InputRightElement,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useShowToast from "../../hooks/useShowToast.js";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom.js";

const Signup = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        major: "",
        hobbies: "",
        country: "",
        uniqueQuality: "",
        bio: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/users/signup", {
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
        <Container maxW={"container.md"} padding={0}>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                gap={10}
                direction={"row"}
            >
                <VStack spacing={4} align={"stretch"} width={"100%"}>
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
                        placeholder="Username"
                        type="text"
                        fontSize={14}
                        value={inputs.username}
                        onChange={(e) =>
                            setInputs({ ...inputs, username: e.target.value })
                        }
                        isRequired
                    />
                    <Input
                        placeholder="Full Name"
                        type="text"
                        fontSize={14}
                        value={inputs.fullName}
                        onChange={(e) =>
                            setInputs({ ...inputs, fullName: e.target.value })
                        }
                        isRequired
                    />

                    <InputGroup>
                        <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            fontSize={14}
                            value={inputs.password}
                            onChange={(e) =>
                                setInputs({
                                    ...inputs,
                                    password: e.target.value,
                                })
                            }
                            isRequired
                        />
                        <InputRightElement>
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </VStack>

                <VStack spacing={4} align={"stretch"} width={"100%"}>
                    <Input
                        placeholder="Major"
                        type="text"
                        fontSize={14}
                        value={inputs.major}
                        onChange={(e) =>
                            setInputs({ ...inputs, major: e.target.value })
                        }
                        isRequired
                    />
                    <Input
                        placeholder="hobbies"
                        type="text"
                        fontSize={14}
                        value={inputs.hobbies}
                        onChange={(e) =>
                            setInputs({ ...inputs, hobbies: e.target.value })
                        }
                        isRequired
                    />

                    <Input
                        placeholder="country"
                        type="text"
                        fontSize={14}
                        value={inputs.country}
                        onChange={(e) =>
                            setInputs({ ...inputs, country: e.target.value })
                        }
                        isRequired
                    />

                    <Input
                        placeholder="Unique Quality"
                        type="text"
                        fontSize={14}
                        value={inputs.uniqueQuality}
                        onChange={(e) =>
                            setInputs({
                                ...inputs,
                                uniqueQuality: e.target.value,
                            })
                        }
                        isRequired
                    />
                </VStack>
            </Flex>
            <Textarea
                mt={5}
                mb={5}
                placeholder="Story"
                type="text"
                fontSize={14}
                value={inputs.bio}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                isRequired
            />

            <Button
                size={"sm"}
                w={"full"}
                colorScheme="blue"
                fontSize={14}
                loadingText="Signing up"
                isLoading={isLoading}
                onClick={handleSignup}
            >
                Sign up
            </Button>
        </Container>
    );
};

export default Signup;
