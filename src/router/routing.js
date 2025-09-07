import { createBrowserRouter, redirect } from 'react-router-dom'
import { APP_ROUTER } from '../utils/Constants'
import MainLayout from '../layout/Main/MainLayout'
import AuthLayout from '../layout/Auth/AuthLayout'
import HomePage from '../page/Home/HomePage'
import Login from '../page/Auth/Login/Login'
import Register from '../page/Auth/Register/Register'
import ProductDetail from '../page/ProductDetail/ProductDetail'
import ProductPage from '../page/Product/ProductPage'
import Logout from '../page/Auth/Logout/Logout'
import Purchase from '../components/Cart/Purchase'
import InforUser from '../page/User/InforUser'
import PurchaseOrder from '../components/Order/PurchaseOrder'
import Search from '../page/Search/Search'
import ShoppingCarts from '../page/Cart/ShoppingCart'
import ListCart from '../page/Cart/ListCart'
import Errors from '../page/Error/Errors'
import SalePage from '../page/Sale/SalePage'

const router = createBrowserRouter([
    {
        path: '/',
        loader: () => {
            if (!localStorage.getItem('user')) {
                throw redirect(APP_ROUTER.HOME)
            }
            return null
        },
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: APP_ROUTER.HOME,
                element: <HomePage />,
                index: true,
            },
            {
                path: APP_ROUTER.USER,
                element: <InforUser />,
                index: true,
            },

            {
                path: APP_ROUTER.ERRORS,
                element: <Errors />,
                index: true,
            },
            {
                path: APP_ROUTER.CARTTEST,
                element: <ShoppingCarts />,
                index: true,
            },
            {
                path: APP_ROUTER.LISTCART,
                element: <ListCart />,
                index: true,
            },
            {
                path: APP_ROUTER.PURCHASE,
                element: <Purchase />,
                index: true,
            },
            {
                path: APP_ROUTER.ORDER,
                element: <PurchaseOrder />,
                index: true,
            },
            {
                path: APP_ROUTER.SEARCH,
                element: <Search />,
                index: true,
            },
            {
                path: APP_ROUTER.SEARCHPAGE,
                element: <Search />,
                index: true,
            },
            {
                path: APP_ROUTER.PRODUCTDETAIL,
                element: <ProductDetail />,
            },
            {
                path: APP_ROUTER.PRODUCT,
                element: <ProductPage />,
            },
            {
                path: APP_ROUTER.SALE,
                element: <SalePage />,
            },
        ],
    },

    {
        path: APP_ROUTER.AUTH,
        element: <AuthLayout />,
        children: [
            {
                path: APP_ROUTER.LOGIN,
                element: <Login />,
                index: true,
            },
            {
                path: APP_ROUTER.REGISTER,
                element: <Register />,
            },
            {
                path: APP_ROUTER.LOGOUT,
                element: <Logout />,
            },
        ],
    },
])

export default router
