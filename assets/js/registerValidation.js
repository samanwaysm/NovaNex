// const name1 = document.getElementById('name');
// const phone = document.getElementById('phone');
// const password = document.getElementById('password');
// const confirmPassword = document.getElementById('confirmPassword');
// const form = document.getElementById('form');
// const errorElement1 = document.getElementById('errorElement1');
// const errorElement2 = document.getElementById('errorElement2');
// const errorElement3 = document.getElementById('errorElement3');
// const errorElement4 = document.getElementById('errorElement4');


// form.addEventListener('submit', (e) => {
//     let nameerrmessage = [];
//     let pherrmessage = [];
//     let passerrmessage = [];
//     let conpasserrmessage = [];

//     if (name1.value === '') {
//         nameerrmessage.push("Username is Required");
//     }
//     if (phone.value === '') {
//         pherrmessage.push("Phone no is Required");
//     }
//     if (password.value === '') {
//         passerrmessage.push("Password is Required");
//     }
//     if (confirmPassword.value === '') {
//         conpasserrmessage.push("Confirm Password is Required");
//     }
//     if (nameerrmessage.length > 0 || pherrmessage.length > 0 || passerrmessage.length > 0 || conpasserrmessage.length > 0) {
//         e.preventDefault(); // Prevent form submission
//         errorElement1.innerText = nameerrmessage.join(', ');
//         errorElement2.innerText = pherrmessage.join(', ');
//         errorElement3.innerText = passerrmessage.join(', ');
//         errorElement4.innerText = conpasserrmessage.join(', ');
//     } else {
//         form.submit();
//     }
// });

//-------------------------------

const name1 = document.getElementById('name');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');
const errorElement4 = document.getElementById('errorElement4');

form.addEventListener('submit', (e) => {
    let nameerrmessage = [];
    let pherrmessage = [];
    let passerrmessage = [];
    let conpasserrmessage = [];

    if (name1.value.trim() === '') {
        nameerrmessage.push("Username is Required");
    }
    if (phone.value === '') {
        pherrmessage.push("Phone number is Required");
    } else if (!isValidPhoneNumber(phone.value)) {
        pherrmessage.push("Invalid Phone number (should have exactly 10 digits)");
    }

    if (password.value.trim() === '') {
        passerrmessage.push("Password is Required");
    }

    if (confirmPassword.value === '') {
        conpasserrmessage.push("Confirm Password is Required");
    } else if (password.value !== confirmPassword.value) {
        conpasserrmessage.push("Passwords do not match");
    }

    if (nameerrmessage.length > 0 || pherrmessage.length > 0 || passerrmessage.length > 0 || conpasserrmessage.length > 0) {
        e.preventDefault(); // Prevent form submission
        errorElement1.innerText = nameerrmessage.join(', ');
        errorElement2.innerText = pherrmessage.join(', ');
        errorElement3.innerText = passerrmessage.join(', ');
        errorElement4.innerText = conpasserrmessage.join(', ');
    } else {
        form.submit();
    }
});

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}
