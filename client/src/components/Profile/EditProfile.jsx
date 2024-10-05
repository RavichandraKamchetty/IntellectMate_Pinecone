import {
    Avatar,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Grid,
    GridItem,
    Textarea,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";

const EditProfile = ({ isOpen, onClose }) => {
    const [authUser, setUser] = useRecoilState(userAtom);
    console.log(authUser)
    const { selectedFile, handleImageChange, setSelectedFile } =
        usePreviewImg();
    const showToast = useShowToast();

    const [inputs, setInputs] = useState({
        email: authUser.email || "",
        fullName: authUser.fullName || "",
        username: authUser.username || "",
        bio: authUser.bio || "",
        password: "",
        major: authUser.major || "",
        hobbies: authUser.hobbies || "",
        state: authUser.state || "",
        age: authUser.age || "",
        sex: authUser.sex || "",
        gpa: authUser.gpa || "",
        uniqueQuality: authUser.uniqueQuality || "",
        year: authUser.year || "",
    });

    useEffect(() => {
        if (authUser) {
            setInputs({
                email: authUser.email || "",
                fullName: authUser.fullName || "",
                username: authUser.username || "",
                bio: authUser.bio || "",
                password: "",
                major: authUser.major || "",
                hobbies: authUser.hobbies || "",
                state: authUser.state || "",
                age: authUser.age || "",
                sex: authUser.sex || "",
                gpa: authUser.gpa || "",
                uniqueQuality: authUser.uniqueQuality || "",
                year: authUser.year || "",
            });
        }
    }, [authUser]);

    const fileRef = useRef(null);
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updating) return;
        setUpdating(true);

        try {
            const res = await fetch(`/api/users/update/${authUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...inputs,
                    profilePicURL: selectedFile,
                }),
            });

            const data = await res.json();
            console.log("Data: ", data);

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Profile updated successfully", "success");
            setUser(data);
            localStorage.setItem("user-info", JSON.stringify(data));
            setSelectedFile(null);
            onClose();
        } catch (error) {
            showToast("Error", error.message, "error");
            return;
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    bg={"black"}
                    boxShadow={"xl"}
                    border={"1px solid gray"}
                    mx={3}
                    maxW={"xl"}
                >
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex bg={"black"}>
                            <Stack
                                w={"full"}
                                spacing={4}
                                maxW={"xl"}
                                bg={"black"}
                                p={6}
                                my={0}
                            >
                                <Heading
                                    lineHeight={1.1}
                                    fontSize={{ base: "2xl", sm: "3xl" }}
                                >
                                    Edit Profile
                                </Heading>
                                <FormControl>
                                    <Stack
                                        direction={["column", "row"]}
                                        spacing={6}
                                    >
                                        <Center>
                                            <Avatar
                                                src={
                                                    selectedFile ||
                                                    authUser.profilePicURL
                                                }
                                                border={"2px solid white"}
                                                size={"xl"}
                                            />
                                        </Center>
                                        <Center w={"full"}>
                                            <Button
                                                w={"full"}
                                                onClick={() =>
                                                    fileRef.current.click()
                                                }
                                            >
                                                Edit Profile Picture
                                            </Button>
                                        </Center>
                                        <Input
                                            type="file"
                                            hidden
                                            ref={fileRef}
                                            onChange={handleImageChange}
                                        />
                                    </Stack>
                                </FormControl>

                                <Grid templateColumns="repeat(1, 1fr)" gap={4}>
                                    {/* Left Side Fields */}
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Email
                                            </FormLabel>
                                            <Input
                                                placeholder="Email"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.email}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Full Name
                                            </FormLabel>
                                            <Input
                                                placeholder="Full Name"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.fullName}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        fullName:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Username
                                            </FormLabel>
                                            <Input
                                                placeholder="Username"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.username}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        username:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Password
                                            </FormLabel>
                                            <Input
                                                placeholder="password"
                                                value={inputs.password}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                _placeholder={{
                                                    color: "gray.500",
                                                }}
                                                type="password"
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Major
                                            </FormLabel>
                                            <Input
                                                placeholder="Major"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.major}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        major: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Hobbies
                                            </FormLabel>
                                            <Input
                                                placeholder="Hobbies"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.hobbies}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        hobbies: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    {/* Right Side Fields */}
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                State
                                            </FormLabel>
                                            <Input
                                                placeholder="State"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.state}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        state: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Age
                                            </FormLabel>
                                            <Input
                                                placeholder="Age"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.age}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        age: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Sex
                                            </FormLabel>
                                            <Input
                                                placeholder="Sex"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.sex}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        sex: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                GPA
                                            </FormLabel>
                                            <Input
                                                placeholder="GPA"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.gpa}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        gpa: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Unique Quality
                                            </FormLabel>
                                            <Input
                                                placeholder="Unique Quality"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.uniqueQuality}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        uniqueQuality:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel fontSize={"sm"}>
                                                Year
                                            </FormLabel>
                                            <Input
                                                placeholder="Year"
                                                size={"sm"}
                                                type="text"
                                                value={inputs.year}
                                                onChange={(e) =>
                                                    setInputs({
                                                        ...inputs,
                                                        year: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                {/* Bio Field with Full Width */}
                                <FormControl mt={4}>
                                    <FormLabel fontSize={"sm"}>Bio</FormLabel>
                                    <Textarea
                                        placeholder="Bio"
                                        size={"sm"}
                                        type="text"
                                        value={inputs.bio}
                                        onChange={(e) =>
                                            setInputs({
                                                ...inputs,
                                                bio: e.target.value,
                                            })
                                        }
                                    />
                                </FormControl>

                                <Stack
                                    spacing={6}
                                    direction={["column", "row"]}
                                >
                                    <Button
                                        bg={"red.400"}
                                        color={"white"}
                                        w={"full"}
                                        size={"sm"}
                                        _hover={{ bg: "red.500" }}
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        bg={"blue.400"}
                                        color={"white"}
                                        w={"full"}
                                        size={"sm"}
                                        _hover={{ bg: "blue.500" }}
                                        isLoading={updating}
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditProfile;
