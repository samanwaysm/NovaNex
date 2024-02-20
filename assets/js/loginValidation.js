// const email = document.getElementById('email');
// const password = document.getElementById('password');
// const form = document.getElementById('form');
// const errorElement1 = document.getElementById('errorElement1');
// const errorElement2 = document.getElementById('errorElement2');

// form.addEventListener('submit', (e) => {
//     let emailerrmessage = [];
//     let passworderrmessage = [];

//     if (email.value.trim() === '') {
//         emailerrmessage.push("Email is Required");
//     } else {
//         if (!emailValid(email.value)) {
//             emailerrmessage.push("Invalid Email");
//         }
//     }
//     // if(password.value=''){
//     //     passworderrmessage.push("password is Required");
//     // }

//     if (emailerrmessage.length > 0 || passworderrmessage.length > 0) {
//         console.log(emailerrmessage);
//         e.preventDefault(); // Prevent form submission
//         errorElement1.innerText = emailerrmessage.join(', ');
//         errorElement2.innerText = passworderrmessage.join(', ');

//     }else{
//         form.submit()
//     }
// });

// function emailValid(email) {
//     const emailRegex = /^[A-Za-z0-9_\-\.]+@gmail+\.[A-Za-z]{3}$/;;
//     return emailRegex.test(email);
// }


const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');

form.addEventListener('submit', (e) => {
    let emailerrmessage = [];
    let passworderrmessage = [];

    if (email.value.trim() === '') {
        emailerrmessage.push("Email is Required");
    } else {
        if (!emailValid(email.value)) {
            emailerrmessage.push("Invalid Email");
        }
    }

    if (password.value.trim() === '') {
        passworderrmessage.push("Password is Required");
    }

    if (emailerrmessage.length > 0 || passworderrmessage.length > 0) {
        e.preventDefault(); // Prevent form submission
        errorElement1.innerText = emailerrmessage.join(', ');
        errorElement2.innerText = passworderrmessage.join(', ');
    } else {
        form.submit();
    }
});

function emailValid(email) {
    const emailRegex = /^[A-Za-z0-9_\-\.]+@gmail+\.[A-Za-z]{3}$/;
    return emailRegex.test(email);
}
