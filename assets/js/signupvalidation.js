const email = document.getElementById('email');
const form = document.getElementById('form');
const errorElement = document.getElementById('errorElement');




form.addEventListener('submit', (e) => {
   
        // let validate = true;

    let errmessage = [];

    // // Check if email is valid (you need to define emailValid)
    // if (!emailValid(email.value)) {
    //     // validate =false
    //     errmessage.push("Invalid Email");
    // }

    // // Check if email is empty
    // if (email.value === '') {
    //     errmessage.push("Email is Required");
    //     // validate = false
    // }


    // Check if email is empty
    if (email.value.trim() === '') {
        errmessage.push("Email is Required");
    } else {
        // Check if email is valid (you need to define emailValid)
        if (!emailValid(email.value)) {
            errmessage.push("Invalid Email");
        }
    }

    // Display error messages, if any
    if (errmessage.length > 0) {
        console.log(errmessage);
        e.preventDefault(); // Prevent form submission
        errorElement.innerText = errmessage.join(', ');
    }else{
        form.submit()
    }

    // if(errmessage.length===0){
    //     form.submit()
    // }

});

function emailValid(email) {
    const emailRegex = /^[A-Za-z0-9_\-\.]+@gmail+\.[A-Za-z]{3}$/;;
    return emailRegex.test(email);
}

// function emailValid(){
//     let emailError=document.getElementById('errorElement')
//     // email.addEventListener('keyup',(k)=>{
//         if(!email.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
//             emailError.innerHTML='Enter a valid email';
//             emailValid=false;
//             return false
//         }
//         emailValid=true;
//         // emailError.innerHTML='trhtr';
//         return true;
//     // })
// }


