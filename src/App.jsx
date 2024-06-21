/*
    Based on tutorial project from "The Ultimate React Course 2024" by Jonas Schmedtmann
*/

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order, { loader as orderLoader } from "./features/order/Order";
import CreateOrder, {
    action as createOrderAction,
} from "./features/order/CreateOrder";
import AppLayout from "./ui/AppLayout";
import { action as updateOrderAction } from "./features/order/UpdateOrder";

// Need to implement React Router using this newer interface in order to
// use data fetching features.
const router = createBrowserRouter([
    {
        // Route with no path, only children = layout route
        element: <AppLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/menu",
                element: <Menu />,
                loader: menuLoader,
                errorElement: <Error />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/order/new",
                element: <CreateOrder />,
                action: createOrderAction,
            },
            {
                path: "/order/:orderId",
                element: <Order />,
                loader: orderLoader,
                errorElement: <Error />,
                action: updateOrderAction,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
