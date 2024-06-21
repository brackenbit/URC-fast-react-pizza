/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
    // Redux recommends data manipulation directly in selector function,
    // with the relevant functions stored in the slice file.
    const totalCartQuantity = useSelector(getTotalCartQuantity);
    const totalCartPrice = useSelector(getTotalCartPrice);

    if (!totalCartQuantity) return null;

    return (
        <div className="flex items-center justify-between bg-stone-800 p-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
            <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
                <span>{totalCartQuantity} pizzas</span>
                <span>{formatCurrency(totalCartPrice)}</span>
            </p>
            <Link to="/cart">Open cart &rarr;</Link>
        </div>
    );
}

export default CartOverview;
