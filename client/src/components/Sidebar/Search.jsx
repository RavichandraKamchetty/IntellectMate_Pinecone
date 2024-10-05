import { SearchLogo } from "../../assets/constants";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
    const { pathname } = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const searchRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let query = searchRef.current.value;
            const res = await fetch(`/api/users/profile/${query}`, {
                method: "GET",
            });

            const data = await res.json();
            setUser(data);

            if (data.error) {
                useShowToast("Error", data.error, "error");
                return;
            }
        } catch (error) {
            useShowToast("Error", error.message, "error");
            return;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Tooltip
                hasArrow
                label="Search"
                placement="right"
                ml={1}
                openDelay={500}
                display={{
                    base: "block",
                    md: pathname == "/chat" ? "block" : "none",
                }}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: pathname == "/chat" ? 10 : "full" }}
                    justifyContent={{
                        base: "center",
                        md: pathname == "/chat" ? "center" : "flex-start"
                    }}
                    onClick={onOpen}
                >
                    <SearchLogo />
                    <Box
                        display={{
                            base: "none",
                            md: pathname == "/chat" ? "none" : "block",
                        }}
                        fontWeight={"bold"}
                    >
                        Search
                    </Box>
                </Flex>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
                <ModalOverlay />
                <ModalContent
                    bg={"black"}
                    border={"1px solid gray"}
                    maxW={"400px"}
                >
                    <ModalHeader>Search User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSearch}>
                            <FormControl>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    placeholder="search a username"
                                    ref={searchRef}
                                />
                            </FormControl>

                            <Flex w={"full"} justifyContent={"flex-end"}>
                                <Button
                                    ml={"auto"}
                                    size={"sm"}
                                    type="submit"
                                    my={4}
                                    isLoading={isLoading}
                                >
                                    Search
                                </Button>
                            </Flex>
                        </form>

                        {user && <SuggestedUser user={user} />}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Search;
