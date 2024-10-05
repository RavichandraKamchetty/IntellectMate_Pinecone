import { atom } from "recoil";

const currentUserAtom = atom({
    key: "currentUserAtom",
    default: null,
});

export default currentUserAtom;
