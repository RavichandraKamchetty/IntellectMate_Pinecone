import { atom } from "recoil";

const suggestedUserAtom = atom({
    key: "suggestedUsersAtom",
    default: [],
});

export default suggestedUserAtom;
