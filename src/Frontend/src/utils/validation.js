export function validateEmail(string) {
    return string.includes('@');
};

export function validatePassword(string) {
    return string.length >= 8;
}

export function validateConfirmPassword(confirmPassword, password) {
    return confirmPassword.length >= 8 && confirmPassword === password;
};

export function validateTitle(string) {
    return string.trim().length > 0;
}