// utils/common.ts

import Cookies from "universal-cookie"
import { IUser, Designer, Customer } from "./dbModels"

export const LIVE = process.env.NEXT_PUBLIC_LIVE === 'true';                  // true for Production, false for Demo
export const LOCAL_DEBUG = process.env.NEXT_PUBLIC_LOCAL_DEBUG === 'true';    // true for local testing or on configurator.site, false for Demo

const API_MAIN_ENDPOINT = process.env.NEXT_PUBLIC_API_MAIN_ENDPOINT;
export const DEBUG_SHOPIFY_ID = process.env.NEXT_PUBLIC_DEBUG_SHOPIFY_ID;
export const DEBUG_DESIGNER_ID = process.env.NEXT_PUBLIC_DEBUG_DESIGNER_ID;

export const APIEndpoints = {
    Customers: `${API_MAIN_ENDPOINT}/customers`,
    Designers: `${API_MAIN_ENDPOINT}/designers`,
    CustomersDebug: `${API_MAIN_ENDPOINT}/customers-dev`,
    DesignersDebug: `${API_MAIN_ENDPOINT}/designers-dev`,
    Drafts: '/drafts',
    Library: '/library',
    Product: '/product',
    DesignStudio: '/ds',
    Collections: '/coll',
    Images: `${API_MAIN_ENDPOINT}/images`
}

export const UsersPrintsStatuses = {
    APPROVED: 'approved',
    PENDING: 'pending',
    DENIED: 'denied'
}

export const API_MEDIA_ENDPOINT = 'https://configurator.site:5002/Media/Upload'

export const PRODUCT_PRICE = LIVE ? 0.99 : 0

export const AUTOSAVE_INTERVAL: number = LIVE ? 45000 : 9000

const CUSTOMER_LOGIN_REDIRECT_URL = process.env.NEXT_PUBLIC_CUSTOMER_LOGIN_REDIRECT_URL;

// export function canGoHomeWithoutSaving(lastSaveTime: number) {
//     const now = new Date().getTime();
//     const save_time_elapsed = (now - lastSaveTime) / 1000;
//     const warning_time_threshold = AUTOSAVE_INTERVAL / 1000 / 2;
//     return save_time_elapsed < warning_time_threshold;
// };


export function shopifyLogin() {
    // Code to set cookie
    const date = new Date()
    const days = 1
    const hours = 1
    const minutes = 30
    const seconds = 60
    const added_time = days * hours * minutes * seconds * 1000 // 30 minutes
    date.setTime(date.getTime() + added_time)

    const cookies = new Cookies()
    cookies.set('login_redirect_url', CUSTOMER_LOGIN_REDIRECT_URL,
        { path: '/', domain: '.faithtribe.io', secure: true, expires: date, sameSite: "none" }
    )

    window.location.replace('https://shop.faithtribe.io/account/login')
}

export function getStoredUser() {
    const ftut_data = localStorage.getItem('ftut')
    if (!ftut_data) return

    const parsed_user = JSON.parse(ftut_data)
    let user: IUser | null = null

    if (parsed_user.type === 'Designer') {
        user = Object.assign(new Designer(), parsed_user)
    }
    else if (parsed_user.type === 'Customer') {
        user = Object.assign(new Customer(), parsed_user)
    }
    return user
}

export function getErrorMessage(error: any): string {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
}
