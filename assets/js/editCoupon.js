const couponcode = document.getElementById('couponcode');
const Expire = document.getElementById('Expire');
const minPurchaseAmount = document.getElementById('minPurchaseAmount');
const maxRedeemableAmount = document.getElementById('maxRedeemableAmount');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement4 = document.getElementById('errorElement4');
const errorElement5 = document.getElementById('errorElement5');
const today = new Date();
form.addEventListener('submit', (e) => {
     let couponcodeerrmessage = [];
     let Expireerrmessage = [];
     let minPurchaseAmounterrmessage = [];
     let maxRedeemableAmounterrmessage = [];
 
     if (couponcode.value.trim() === '') {
         couponcodeerrmessage.push("Coupon code is Required");
     }
 
     if (Expire.value === '') {
          Expireerrmessage.push("Expiration date is Required");
     } else {
          const selectedDate = new Date(Expire.value);
          if (selectedDate < today) {
              Expireerrmessage.push("Please select a future date for expiration");
          }
     }
 
 
     if (minPurchaseAmount.value === '') {
            minPurchaseAmounterrmessage.push("Minimum purchase amount is Required");
     }else if (parseFloat(minPurchaseAmount.value) < 0) {
            minPurchaseAmounterrmessage.push("Minimum purchase cannot be negative");
    }
      
     if (maxRedeemableAmount.value === '') {
          maxRedeemableAmounterrmessage.push("Max redeemable amount is Required");
     }else if (parseFloat(maxRedeemableAmount.value) < 0) {
          maxRedeemableAmounterrmessage.push("Max redeemable amount cannot be negative");
     }
     if (minPurchaseAmount.value !== '' && maxRedeemableAmount.value !== '' && parseFloat(minPurchaseAmount.value) < parseFloat(maxRedeemableAmount.value)) {
          maxRedeemableAmounterrmessage.push("It should be lessthan Max redeemable amount");
      }
 
     if (
         couponcodeerrmessage.length > 0 ||
         Expireerrmessage.length > 0 ||
         minPurchaseAmounterrmessage.length > 0 ||
         maxRedeemableAmounterrmessage.length > 0
     ) {
         e.preventDefault(); // Prevent form submission
         errorElement1.innerText = couponcodeerrmessage.join(', ');
         errorElement2.innerText = Expireerrmessage.join(', ');
         errorElement4.innerText = minPurchaseAmounterrmessage.join(', ');
         errorElement5.innerText = maxRedeemableAmounterrmessage.join(', ');
     } else {
          form.submit();
     }
 });
 