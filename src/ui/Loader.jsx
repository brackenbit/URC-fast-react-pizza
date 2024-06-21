/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

export default function Loader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
            <div className="loader"></div>
        </div>
    );
}
