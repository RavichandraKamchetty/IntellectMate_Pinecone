import { Box, Container, Flex } from "@chakra-ui/react";
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";

const Homepage = () => {
    return (
        <Container maxW={"container.lg"}>
            <Flex gap={20}>
                <Box flex={2} py={10}>
                    <FeedPosts />
                </Box>

                <Box
                    flex={3}
                    mr={20}
                    maxW={"300px"}
                    display={{ base: "none", lg: "block" }}
                >
                    <SuggestedUsers />
                </Box>
            </Flex>
        </Container>
    );
};

export default Homepage;
