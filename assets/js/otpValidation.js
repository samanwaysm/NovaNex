const otp = document.getElementById('otp');
const form = document.getElementById('form');
const errorElement = document.getElementById('errorElement');

form.addEventListener('submit', (e) => {

let errmessage = [];

if (otp.value.trim() === '') {
        errmessage.push("Please enter OTP");
} 

if (errmessage.length > 0) {
    console.log(errmessage);
    e.preventDefault(); 
    errorElement.innerText = errmessage.join(', ');
}else{
    form.submit()
}

});