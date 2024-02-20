const name1 = document.getElementById('name');
const phone = document.getElementById('phone');
const oldPassword = document.getElementById('oldPassword');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');
const errorElement4 = document.getElementById('errorElement4');
const errorElement5 = document.getElementById('errorElement5');

form.addEventListener('submit', (e) => {
    let nameerrmessage = [];
    let pherrmessage = [];
    let oldpasserrmessage = [];
    let newpasserrmessage = [];
    let conpasserrmessage = [];
    if (name1.value.trim() === '') {
        nameerrmessage.push("Username is Required");
    }
    if (phone.value.trim() === '') {
        pherrmessage.push("Phone number is Required");
    } else if (!isValidPhoneNumber(phone.value)) {
        pherrmessage.push("Invalid Phone number (should have exactly 10 digits)");
    }

    if (oldPassword.value.trim() === '') {
        oldpasserrmessage.push("Old Password is Required");
    }

    if (newPassword.value.trim() === '') {
        newpasserrmessage.push("New Password is Required");
    }else if (!isStrongPassword(newPassword.value)) {
        newpasserrmessage.push("Password should be strong (at least 8 characters, including uppercase, lowercase, and numbers)");
    }

    if (confirmPassword.value === '') {
        conpasserrmessage.push("Confirm Password is Required");
    } else if (newPassword.value !== confirmPassword.value) {
        conpasserrmessage.push("Passwords do not match");
    }

    if (nameerrmessage.length > 0 || pherrmessage.length > 0 || oldpasserrmessage.length > 0 || newpasserrmessage.length > 0 || conpasserrmessage.length > 0) {
        e.preventDefault(); // Prevent form submission
        errorElement1.innerText = nameerrmessage.join(', ');
        errorElement2.innerText = pherrmessage.join(', ');
        errorElement3.innerText = oldpasserrmessage.join(', ');
        errorElement4.innerText = newpasserrmessage.join(', ');
        errorElement5.innerText = conpasserrmessage.join(', ');
    } else {
        form.submit();
    }
});

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

function isStrongPassword(newPassword) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(newPassword);
}