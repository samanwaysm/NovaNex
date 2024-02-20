const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('form');

const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');

form.addEventListener('submit', (e) => {

        let passerrmessage = [];
        let conpasserrmessage = [];

        if (password.value === '') {
                passerrmessage.push("Password is Required");
        }else if (!isStrongPassword(password.value)) {
                passerrmessage.push("Password should be strong (at least 8 characters, including uppercase, lowercase, and numbers)");
        }
        
        if (confirmPassword.value === '') {
            conpasserrmessage.push("Confirm Password is Required");
        } else if (password.value !== confirmPassword.value) {
            conpasserrmessage.push("Passwords do not match");
        }

        if (passerrmessage.length > 0 || conpasserrmessage.length > 0) {
                e.preventDefault(); // Prevent form submission
                errorElement1.innerText = passerrmessage.join(', ');
                errorElement2.innerText = conpasserrmessage.join(', ');
        } else {
                form.submit();
            }
        });

        function isStrongPassword(password) {
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            return strongPasswordRegex.test(password);
        }