const category = document.getElementById('category');
const discount = document.getElementById('discount');
const expiredDate = document.getElementById('expiredDate');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');

form.addEventListener('submit', (e) => {
     let categoryerrmessage = [];
     let discounterrmessage = [];
     let expiredDateerrmessage = [];
 
     if (category.value.trim() === '') {
          categoryerrmessage.push("Category is Required");
     }
     if (discount.value.trim() === '') {
          discounterrmessage.push("Discount is Required");
     } else {
          const discountValue = parseFloat(discount.value);
          if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
              discounterrmessage.push("Discount must be a percentage value between 0 and 100");
          }
     }
     if (expiredDate.value.trim() === '') {
          expiredDateerrmessage.push("Expired Date is Required");
      } else {
          const currentDate = new Date();
          const selectedDate = new Date(expiredDate.value);
          if (selectedDate <= currentDate) {
              expiredDateerrmessage.push("Expired Date must be in the future");
          }
      }

     if (categoryerrmessage.length > 0 || discounterrmessage.length > 0 || expiredDateerrmessage.length > 0) {
          e.preventDefault(); 
          errorElement1.innerText = categoryerrmessage.join(', ');
          errorElement2.innerText = discounterrmessage.join(', ');
          errorElement3.innerText = expiredDateerrmessage.join(', ');
     }else {
          form.submit();
     }
});

