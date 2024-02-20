const name1 = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');
const errorElement4 = document.getElementById('errorElement4');
const errorElementEmail = document.getElementById('errorElementEmail');


form.addEventListener('submit', (e) => {
    let nameerrmessage = [];
    let emailerrmessage = [];
    let pherrmessage = [];
    let passerrmessage = [];
    let conpasserrmessage = [];

    if (name1.value.trim() === '') {
        nameerrmessage.push("Username is Required");
    }
    if (email.value.trim() === '') {
        emailerrmessage.push("Email is Required");
    } else {
        if (!emailValid(email.value)) {
                emailerrmessage.push("Invalid Email");
        }
    }
    if (phone.value.trim() === '') {
        pherrmessage.push("Phone number is Required");
    } else if (!isValidPhoneNumber(phone.value)) {
        pherrmessage.push("Invalid Phone number (should have exactly 10 digits)");
    }

    if (password.value.trim() === '') {
        passerrmessage.push("Password is Required");
    } else if (!isStrongPassword(password.value)) {
        passerrmessage.push("Password should be strong (at least 8 characters, including uppercase, lowercase, and numbers)");
    }

    if (confirmPassword.value.trim() === '') {
        conpasserrmessage.push("Confirm Password is Required");
    } else if (password.value !== confirmPassword.value) {
        conpasserrmessage.push("Passwords do not match");
    }

    if (nameerrmessage.length > 0 || pherrmessage.length > 0 || passerrmessage.length > 0 || conpasserrmessage.length > 0 || emailerrmessage.length > 0) {
        e.preventDefault();
        errorElement1.innerText = nameerrmessage.join(', ');
        errorElementEmail.innerText = emailerrmessage.join(', ');
        errorElement2.innerText = pherrmessage.join(', ');
        errorElement3.innerText = passerrmessage.join(', ');
        errorElement4.innerText = conpasserrmessage.join(', ');
    } else {
        form.submit();
    }
});

function emailValid(email) {
    const emailRegex = /^[A-Za-z0-9_\-\.]+@gmail+\.[A-Za-z]{3}$/;;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
}