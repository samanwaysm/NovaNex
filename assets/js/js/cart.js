

// function changeQuantity(amount) {
//   const quantityInput = document.getElementById('quantity');
//   let newQuantity = parseInt(quantityInput.value) + amount;
//   newQuantity = newQuantity < 1 ? 1 : newQuantity; // Ensure quantity is at least 1

//   // Update the input field value
//   quantityInput.value = newQuantity;

//   // You may want to perform additional actions here, such as triggering an API call
//   // Example: updateQuantity(newQuantity);
// }


// $(document).ready(function () {
//   var quantitySelect = document.querySelectorAll('#quantity');
//   console.log(quantitySelect);

//   quantitySelect.forEach((qtyselected, index) => {
//     qtyselected.addEventListener('change', function (e) {
//       if (parseInt(quantitySelect[index].value) >= 1) {
//         e.preventDefault();
//         var href = document.querySelectorAll('.quantity')[index].getAttribute('data-Url');
//         var quantity = qtyselected.value;
//         console.log(quantity);
//         console.log(href);
//       }else{
//         quantitySelect[index].value = '1';
//       }
//       console.log('hehe');

//       $.ajax({
//         url: `${href}&quantity=${quantity}`,
//         method: 'Post',
//         success: function (data) {
//           if(data.message=='outOfStock'){
//             window.location.href=data.url
//           }
//           location.reload() 
//             console.log('Data:', data);
           
  
//         },
//         error: function (error) {
//             console.error('Error:', error);
//         }
//     });

//     });
//   });
// });

//------------------------------------


// function changeQuantity(amount) {
//   const quantityInput = document.getElementById('quantity');
//   let newQuantity = parseInt(quantityInput.value) + amount;
//   newQuantity = newQuantity < 1 ? 1 : newQuantity; 

//   // Update the input field value
//   quantityInput.value = newQuantity;


// }


// $(document).ready(function () {
//   var quantitySelect = document.querySelectorAll('#quantity');

//   quantitySelect.forEach((qtyselected, index) => {
//     qtyselected.addEventListener('change', function (e) {
//       if (parseInt(quantitySelect[index].value) >= 1) {
//         e.preventDefault();
//         var href = document.querySelectorAll('.quantity')[index].getAttribute('data-Url');
//         var quantity = qtyselected.value;
//         console.log(quantity);
//         console.log(href);
//       }else{
//         quantitySelect[index].value = '1';
//       }

//       $.ajax({
//         url: `${href}&quantity=${quantity}`,
//         method: 'Post',
//         success: function (data) {
//           if(data.message=='outOfStock'){
//             window.location.href=data.url
//           }
//           location.reload() 
//             console.log('Data:', data);
           
  
//         },
//         error: function (error) {
//             console.error('Error:', error);
//         }
//     });

//     });
//   });
// });

//------------------------------------------------
// function changeQuantity(amount, index) {
//   const quantityInput = document.getElementById(`quantity${index}`);
//   let newQuantity = parseInt(quantityInput.value) + amount;
//   newQuantity = newQuantity < 1 ? 1 : newQuantity; 

//   // Update the input field value
//   quantityInput.value = newQuantity;

//   // Trigger change event
//   quantityInput.dispatchEvent(new Event('change'));
// }

// $(document).ready(function () {
//   var quantitySelect = document.querySelectorAll('.quantity-input');

//   quantitySelect.forEach((qtyselected, index) => {
//       qtyselected.addEventListener('change', function (e) {
//           if (parseInt(quantitySelect[index].value) >= 1) {
//               var href = document.querySelectorAll('.quantity')[index].getAttribute('data-Url');
//               var quantity = qtyselected.value;
//               console.log(quantity);
//               console.log(href);

//               $.ajax({
//                   url: `${href}&quantity=${quantity}`,
//                   method: 'Post',
//                   success: function (data) {
//                       if (data.message == 'outOfStock') {
//                           window.location.href = data.url;
//                       }
//                       location.reload();
//                       console.log('Data:', data);
//                   },
//                   error: function (error) {
//                       console.error('Error:', error);
//                   }
//               });
//           } else {
//               quantitySelect[index].value = '1';
//           }
//       });
//   });
// });


//-------------------------------
// $(document).ready(function () {
//     var quantitySelect = document.querySelectorAll('.quantity-input');

//     quantitySelect.forEach((qtyselected, index) => {
//         qtyselected.addEventListener('change', function (e) {
//             if (parseInt(quantitySelect[index].value) >= 1) {
//                 var href = document.querySelectorAll('.quantity')[index].getAttribute('data-Url');
//                 var quantity = qtyselected.value;

//                 $.ajax({
//                     url: `${href}&quantity=${quantity}`,
//                     method: 'Post',
//                     success: function (data) {
//                         if (data.message == 'outOfStock') {
//                             outofstock();
//                             window.location.href = data.url;
//                         } else {
//                             // Update UI with product data
//                             console.log('Product updated successfully:', data.product);
//                         }
//                     },
//                     error: function (error) {
//                         console.error('Error:', error);
//                         // Display error message to user
//                         alert('An error occurred while updating the product quantity. Please try again.');
//                     }
//                 });
//             } else {
//                 quantitySelect[index].value = '1';
//             }
//             return false; // Prevent default form submission
//         });
//     });
// });
// function outofstock(){

//     // $('#error-message').html('<p class="error ms-1 text-danger" style="font-size:14px">out of stock</p>');
//     // document.getElementById('subtotal-display').innerHTML = data.product.firstPrice * 2
//     // document.getElementById('discounttotal-display').innerHTML = 
//     // document.getElementById('total-display').innerHTML = 
// }


            function decrementQuantity(index, productId) {
                var inputElement = document.getElementById('form' + index);
                inputElement.stepDown();
                handleInputChange(inputElement.value, productId);
            }

            function incrementQuantity(index, productId) {
                var inputElement = document.getElementById('form' + index);
                inputElement.stepUp();
                handleInputChange(inputElement.value, productId);
            }

            function handleInputChange(newValue, productId) {
                $.ajax({
                    url: `/api/updateProductQuantity?qid=${newValue}&productId=${productId}`,
                    method: 'GET',
                })
                    .then(res => {
                        if (res.status) {
                            // Reload the page
                            location.reload();
                        }
                    })
                    .catch(err => {
                        console.error('There was a problem with the AJAX request:', err);
                    })
            }



// var discountTotalElement = document.getElementById("discounttotal-display"); 
// var discountTotalValue = parseFloat(discountTotalElement.innerText);

// var subTotalElement = document.getElementById("subtotal-display");
// var subTotalValue = parseFloat(subTotalElement.innerText);

// var offerDiscont = document.getElementById("offer-discont");
// var offerDiscontValue = parseFloat(offerDiscont.innerText);

// if(offerDiscontValue>0 && discountTotalValue && subTotalValue){
//     var calculatedTotal = (subTotalValue- discountTotalValue) - offerDiscontValue
// }
// if(discountTotalValue && subTotalValue){
//     var calculatedTotal = (subTotalValue- discountTotalValue)
// }


console.log(calculatedTotal);

document.getElementById("total-display").innerHTML=calculatedTotal;

