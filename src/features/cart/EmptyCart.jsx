/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import LinkButton from "../../ui/LinkButton";

function EmptyCart() {
    return (
        <div className="px-4 py-3">
            <LinkButton to="/menu">&larr; Back to menu</LinkButton>

            <p className="mt-7 font-semibold">
                Your cart is still empty. Start adding some pizzas :)
            </p>
        </div>
    );
}

export default EmptyCart;
