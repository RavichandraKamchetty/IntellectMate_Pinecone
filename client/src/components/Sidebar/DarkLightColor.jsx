import { Box, Flex, Tooltip, useColorMode } from "@chakra-ui/react"
import { IoMoonSharp, IoMoonOutline } from "react-icons/io5";

const DarkLightColor = () => {

    const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Tooltip
            hasArrow
            label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}
        >
            <Flex
                alignItems={"center"}
                gap={4}
                _hover={{ bg: "whiteAlpha.400" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{
                    base: "center",
                    md: "flex-start",
                }}
                onClick={toggleColorMode}
            >
                {colorMode !== "dark" ?  <IoMoonSharp /> : <IoMoonOutline />}
                <Box
                    display={{ base: "none", md: "block" }}
                    fontWeight={"bold"}
                >
                    {colorMode !== "dark" ? "Dark Mode" : "Light Mode"}
                </Box>
            </Flex>
        </Tooltip>
  )
}

export default DarkLightColor