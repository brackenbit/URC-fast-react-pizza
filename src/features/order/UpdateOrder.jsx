/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

export default function UpdateOrder({ order }) {
    const fetcher = useFetcher();

    return (
        <fetcher.Form method="PATCH" className="text-right">
            <Button type="primary">Make priority</Button>
        </fetcher.Form>
    );
}

export async function action({ request, params }) {
    const data = { priority: true };

    await updateOrder(params.orderId, data);

    return null;
}
