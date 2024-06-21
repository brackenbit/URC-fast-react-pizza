/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann

    Updated to prevent sharing position (lat, lon) when user has manually overwritten
    address populated by geolocation.
    This was a security flaw, and required making the address field a controlled component
    and adding a new useEffect.
*/

import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str,
    );

function CreateOrder() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const dispatch = useDispatch();
    const {
        username,
        status: addressStatus,
        position,
        address,
        error: addressError,
    } = useSelector((state) => state.user);
    const isLoadingAddress = addressStatus === "loading";

    const formErrors = useActionData();

    const [withPriority, setWithPriority] = useState(false);
    const cart = useSelector(getCart);
    const totalCartPrice = useSelector(getTotalCartPrice);
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
    const totalPrice = totalCartPrice + priorityPrice;

    const [addressField, setAddressField] = useState(address);

    useEffect(() => {
        setAddressField(address);
    }, [address]);

    function handleGetPosition(e) {
        e.preventDefault();
        dispatch(fetchAddress());
    }

    if (!cart.length) return <EmptyCart />;

    return (
        <div className="px-4 py-6">
            <h2 className="mb-8 text-xl font-semibold">
                Ready to order? Let&apos;s go!
            </h2>

            <Form method="POST">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input
                        type="text"
                        name="customer"
                        required
                        className="input grow"
                        defaultValue={username}
                    />
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="input w-full"
                        />
                    </div>
                    {formErrors?.phone && (
                        <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                            {formErrors.phone}
                        </p>
                    )}
                </div>

                <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            className="input w-full"
                            type="text"
                            name="address"
                            disabled={isLoadingAddress}
                            value={addressField}
                            onChange={(e) => setAddressField(e.target.value)}
                            required
                        />
                        {addressStatus === "error" && (
                            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                                {addressError}
                            </p>
                        )}
                    </div>

                    {!position.latitude && !position.longitude && (
                        <span className="absolute right-[3px] top-[3px] z-50 sm:right-[5px] sm:top-[5px]">
                            <Button
                                type="small"
                                disabled={isLoadingAddress}
                                onClick={(e) => handleGetPosition(e)}
                            >
                                {isLoadingAddress
                                    ? "Loading..."
                                    : "Get position"}
                            </Button>
                        </span>
                    )}
                </div>

                <div className="mb-12 flex items-center gap-5">
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                    />
                    <label htmlFor="priority" className="font-medium">
                        Want to give your order priority?
                    </label>
                </div>

                <div>
                    {/* Hidden inputs to include additional info in form submit */}
                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />
                    <input
                        type="hidden"
                        name="position"
                        value={
                            // Only share position if address hasn't been overwritten by user
                            addressField === address
                                ? position.longitude && position.latitude
                                    ? `${position.latitude},${position.longitude}`
                                    : ""
                                : {}
                        }
                    />
                    <Button disabled={isSubmitting} type="primary">
                        {isSubmitting
                            ? "Placing order..."
                            : `Order now for ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

// Used as action in createBrowserRouter for "/order/new"
// Intercepts form submit, and acts on form data
export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === "true",
    };

    const errors = {};
    if (!isValidPhone(order.phone)) {
        errors.phone =
            "Please give us your correct phone number. We might need it to contact you.";
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    const newOrder = await createOrder(order);

    /* 
    Want to use dispatch here, but useDispatch can only be used in a component (it's a hook).
    Hack - import store directly to use it.
    "Don't overuse this technique" - deactivates some performance improvements.
    */
    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
