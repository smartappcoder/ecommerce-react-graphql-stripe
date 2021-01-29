export const calculatePrice = items => {
    return `$${items
                .reduce((acc, item) => acc + item.quantity * item.price, 0)
                .toFixed(2)
            }`
}

//  localStoarge helpers
const CART_KEY="eCommerce_tutorial_cart"
const JWT_TOKEN_KEY="eCommerce_tutorial_jwt"

export const clearLocalStorageItem = (tokenKey) => {
    if (localStorage && localStorage.getItem(tokenKey)) {
        localStorage.removeItem(tokenKey);
    }
}

export const setCart = (value, cartKey=CART_KEY) => {
    if (localStorage) {
        localStorage.setItem(cartKey, JSON.stringify(value));
    }
}

export const getCart = (cartKey=CART_KEY) => {
    if (localStorage && localStorage.getItem(cartKey)) {
        return JSON.parse(localStorage.getItem(cartKey));
    }
    return [];
}

export const clearCart = (cartKey=CART_KEY) => clearLocalStorageItem(cartKey);

export const setToken = (value, tokenKey=JWT_TOKEN_KEY) => {
    if (localStorage) {
        localStorage.setItem(tokenKey, JSON.stringify(value));
    }
}

export const getToken = (tokenKey=JWT_TOKEN_KEY) => {
    if (localStorage && localStorage.getItem(tokenKey)) {
        return JSON.parse(localStorage.getItem(tokenKey));
    }
    return null;
}

export const clearToken = (tokenKey=JWT_TOKEN_KEY) => clearLocalStorageItem(tokenKey);

// export const clearToken = (tokenKey=JWT_TOKEN_KEY) => {
//     if (localStorage && localStorage.getItem(tokenKey)) {
//         localStorage.removeItem(tokenKey);
//     }
// }
