import { Avatar, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import useLogout from "../../hooks/useLogout";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";

const SuggestedHeader = () => {
    const logout = useLogout();
    const currentUser = useRecoilValue(userAtom);
    console.log(currentUser)

    return (
        <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
            <Flex alignItems={"center"} gap={2}>
                <Avatar src={currentUser?.profilePicURL} size={"sm"} alt="profile pic" />
                <Text fontSize={14} fontWeight={"bold"}>
                    {currentUser?.username}
                </Text>
            </Flex>

            <Button
            size={'xs'}
                background={"transparent"}
                _hover={{ background: "transparent" }}
                fontSize={14}
                fontWeight={"medium"}
                color={"blue.400"}
                style={{ textDecoration: "none" }}
                cursor={"pointer"}
                onClick={logout}
            >
                Log out
            </Button>
        </Flex>
    );
};

export default SuggestedHeader;
