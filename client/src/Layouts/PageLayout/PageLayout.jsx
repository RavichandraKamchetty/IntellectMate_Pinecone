import { Flex, Box, Spinner } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { unstable_HistoryRouter, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { useEffect, useState } from "react";

const PageLayout = ({ children }) => {
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const user = useRecoilValue(userAtom);

    const canRenderSidebar = pathname !== "/auth" && user;

    const canRenderNavbar = !user && !loading && pathname !== "/auth";

    const checkingUserIsAuth = !user && loading;

    if (checkingUserIsAuth) {
        return <PageLayoutSpinner />;
    }

    return (
        <Flex flexDir={canRenderNavbar ? "column" : "row"}>
            {/* sidebar on the left */}
            {canRenderSidebar ? (
                <Box
                    w={{
                        base: "70px",
                        md: pathname === "/chat" ? "70px" : "240px",
                    }}
                >
                    <Sidebar />
                </Box>
            ) : null}

            {canRenderNavbar ? <Navbar /> : null}

            {/* page content on the right */}

            <Box
                flex={1}
                w={{
                    base: "calc(100% - 70px)",
                    md:
                        pathname === "/chat"
                            ? "calc(100% - 70px)"
                            : "calc(100% - 240px)",
                }}
                mx={"auto"}
            >
                {children}
            </Box>
        </Flex>
    );
};

export default PageLayout;

const PageLayoutSpinner = () => {
    return (
        <Flex
            flexDir={"column"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Spinner size={"xl"} />
        </Flex>
    );
};
