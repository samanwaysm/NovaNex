const name1 = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.getElementById('form') || document.getElementById('add_user') || document.getElementById('update_user');
const errorElement = document.getElementById('errorElement');
let emailValid=true;;


form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let errmessage = [];
   

    if(name1.value==='' || name1.value===null){
        errmessage.push("Name is required");
    }
    if(password.value==='' || password.value===null){
        errmessage.push("Password required")
    }
    if(!emailValid || email.value=='' ||email.value==null){
        errmessage.push("Email Required")
    }

    if(errmessage.length>0){
         
        errorElement.innerText=errmessage.join(', ');
    }else{
            // alert("User added Successfully");
    }
})

function validateEmail(){
    let emailError=document.getElementById('email-error')
    // email.addEventListener('keyup',(k)=>{
        if(!email.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
            emailError.innerHTML='<i class="fa-solid fa-circle-check" style="color: #ff0000;"></i>';
            emailValid=false;
            return false
        }
        emailValid=true;
        emailError.innerHTML='trhtr';
        return true;
    // })
}
