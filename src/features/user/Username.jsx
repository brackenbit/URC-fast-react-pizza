/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useSelector } from "react-redux";

export default function Username() {
    const username = useSelector((state) => state.user.username);

    if (!username) {
        return null;
    }

    return (
        <div className="hidden text-sm font-semibold md:block">{username}</div>
    );
}
