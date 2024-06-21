/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
    calcMinutesLeft,
    formatCurrency,
    formatDate,
} from "../../utils/helpers";
import OrderItem from "./OrderItem";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
    const order = useLoaderData();

    // useFetcher - allows using data loaded by a React Router route,
    // without having to actually navigate
    const fetcher = useFetcher();

    useEffect(() => {
        if (!fetcher.data && fetcher.state === "idle") {
            fetcher.load("/menu");
        }
    }, [fetcher]);

    // Example project suggests omitting names and addresses "for privacy reasons".
    // This does nothing to actually protect information, but this is a problem with the backend which is out of my control.
    const {
        status,
        priority,
        priorityPrice,
        orderPrice,
        estimatedDelivery,
        cart,
    } = order;
    const deliveryIn = calcMinutesLeft(estimatedDelivery);

    return (
        <div className="space-y-8 px-4 py-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Status</h2>

                <div className="space-x-2">
                    {priority && (
                        <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
                            Priority
                        </span>
                    )}
                    <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
                        {status} order
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
                <p className="font-medium">
                    {deliveryIn >= 0
                        ? `Only ${calcMinutesLeft(
                              estimatedDelivery,
                          )} minutes left 😃`
                        : "Order should have arrived"}
                </p>
                <p className="text-xs text-stone-500">
                    (Estimated delivery: {formatDate(estimatedDelivery)})
                </p>
            </div>

            <ul className="dive-stone-200 divide-y border-b border-t">
                {cart.map((item) => (
                    <OrderItem
                        item={item}
                        key={item.pizzaId}
                        ingredients={
                            fetcher?.data?.find((el) => el.id === item.pizzaId)
                                ?.ingredients ?? []
                        }
                        isLoadingIngredients={fetcher.state === "loading"}
                    />
                ))}
            </ul>

            <div className="space-y-2 bg-stone-200 px-6 py-5">
                <p className="text-sm font-medium text-stone-600">
                    Price pizza: {formatCurrency(orderPrice)}
                </p>
                {priority && (
                    <p className="text-sm font-medium text-stone-600">
                        Price priority: {formatCurrency(priorityPrice)}
                    </p>
                )}
                <p className="font-bold">
                    To pay on delivery:{" "}
                    {formatCurrency(orderPrice + priorityPrice)}
                </p>
            </div>

            {!priority && <UpdateOrder order={order} />}
        </div>
    );
}

export async function loader({ params }) {
    // React Router passes params amongst arguments to loader function
    const order = await getOrder(params.orderId);
    return order;
}

export default Order;
