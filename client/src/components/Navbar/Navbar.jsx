import { Button, Container, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom";

const Navbar = () => {

    const setScreen = useSetRecoilState(authScreenAtom);

    return (
        <Container maxW={"container.lg"} my={4}>
            <Flex
                w={"full"}
                justifyContent={{ base: "center", md: "space-between" }}
                alignItems={"center"}
            >
                <Image
                    src="/logo.png"
                    h={20}
                    display={{ base: "none", md: "block" }}
                    cursor={"pointer"}
                />

                <Flex gap={4}>
                    <Link to={"/auth"}>
                        <Button colorScheme="blue" size={"sm"} onClick={() => setScreen('login')}>
                            Log in
                        </Button>
                    </Link>

                    <Link to={"/auth"}>
                        <Button variant="outline" size={"sm"} onClick={() => setScreen('signup')}>
                            Signup
                        </Button>
                    </Link>
                </Flex>
            </Flex>
        </Container>
    );
};

export default Navbar;
