const name1 = document.getElementById('fName');
const pincode = document.getElementById('pincode');
const locality = document.getElementById('locality');
const address = document.getElementById('address');
const district = document.getElementById('district');
const state = document.getElementById('state');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');
const errorElement4 = document.getElementById('errorElement4');
const errorElement5 = document.getElementById('errorElement5');
const errorElement6 = document.getElementById('errorElement6');

form.addEventListener('submit', (e) => {
    let nameerrmessage = [];
    let pincodeerrmessage = [];
    let localityerrmessage = [];
    let addresserrmessage = [];
    let districterrmessage = [];
    let stateerrmessage = [];

    if (name1.value.trim() === '') {
        nameerrmessage.push("Username is Required");
    }

    if (pincode.value.trim() === '') {
        pincodeerrmessage.push("Pincode is Required");
    }

    if (locality.value.trim() === '') {
        localityerrmessage.push("Locality is Required");
    }

    if (address.value.trim() === '') {
        addresserrmessage.push("Address is Required");
    }

    if (district.value.trim() === '') {
        districterrmessage.push("District is Required");
    }

    if (state.value.trim() === '') {
        stateerrmessage.push("State is Required");
    }

    if (nameerrmessage.length > 0 || pincodeerrmessage.length > 0 || localityerrmessage.length > 0 || addresserrmessage.length > 0 || districterrmessage.length > 0 || stateerrmessage.length > 0) {
        e.preventDefault(); // Prevent form submission
        errorElement1.innerText = nameerrmessage.join(', ');
        errorElement2.innerText = pincodeerrmessage.join(', ');
        errorElement3.innerText = localityerrmessage.join(', ');
        errorElement4.innerText = addresserrmessage.join(', ');
        errorElement5.innerText = districterrmessage.join(', ');
        errorElement6.innerText = stateerrmessage.join(', ');
    } else {
        form.submit();
    }
});