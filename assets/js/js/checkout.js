async function setAsDefault(addressId) {
    try {
        const response = await fetch(`/api/changeToDefault?id=${addressId}&returnTo=checkout`, {
            method: 'GET', // or 'POST' based on your server route
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Reload the page or update the UI as needed
            location.reload(); // Example: reload the page
        } else {
            console.error('Failed to set default address');
        }
    } catch (error) {
        console.error('Error during setAsDefault:', error);
    }
}

// var discountTotalElement = document.getElementById("discounttotal-display"); 
// var discountTotalValue = parseFloat(discountTotalElement.innerText);

// var subTotalElement = document.getElementById("subtotal-display");
// var subTotalValue = parseFloat(subTotalElement.innerText);


// var calculatedTotal = subTotalValue - discountTotalValue
// console.log(calculatedTotal);


document.addEventListener('DOMContentLoaded', function() {
    // Get the visible input field
    var visibleInput = document.getElementById('couponCode');

    // Get the hidden input field
    var hiddenInput = document.getElementById('Setcoupon');

    // Add an event listener to the visible input field
    visibleInput.addEventListener('input', function() {
        // Update the value of the hidden input field with the value from the visible input field
        hiddenInput.value = visibleInput.value;
    });
});


// document.getElementById("total-display").innerHTML=calculatedTotal;
// document.getElementById("totalAmount").value=calculatedTotal;
// function proceedToBuy() {
//         // Check if payment method and address are selected
//         var selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
//         var selectedAddress = document.querySelector('.addresses-item.border-primary');
//         console.log(selectedPaymentMethod,selectedAddress);
//         var proceedButton = document.getElementById('proceedToBuyBtn');

//         if (selectedPaymentMethod || selectedAddress) {
//             // If both payment method and address are selected, show the button
//             proceedButton.style.display = 'block';
//         } else {
//             // If either payment method or address is not selected, hide the button
//             proceedButton.style.display = 'none';
//         }
//     }

function proceedToBuy() {
    // Check if payment method and address are selected
    var selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    var selectedAddress = document.querySelector('.addresses-item.border-primary');

    var proceedButton = document.getElementById('proceedToBuyBtn');

    if (selectedPaymentMethod || selectedAddress) {
        // If both payment method and address are selected, show the button
        proceedButton.style.display = 'block';
    } else {
        // If either payment method or address is not selected, hide the button
        proceedButton.style.display = 'none';
    }
}


    document.getElementById('proceedToBuyBtn').addEventListener('click', function(event) {
        event.preventDefault()
        console.log($('#checkoutForm').serialize());
        $.ajax({           
          url: '/api/userCheckout',
          data: $('#checkoutForm').serialize(),
          type: "POST"
        })
        .then(res => {
            
            // alert(res.message)
            console.log(res);
            if(res.message){
               document.getElementById('error').style.display = "block"
               document.getElementById('error').innerHTML = res.message
            }
            // console.log(res.paymentMethod)
            if(res.err){
                return location.href = res.url;
            }
            
            if(res.paymentMethod == 'cod'){
              
                return location.href = res.url;
            }
            if(res.paymentMethod == 'wallet'){
          
                if(res.message=='Insufficient wallet balance'){
                   alert('Insufficient wallet balance')
                }
                return location.href = res.url;
            }
            
            
            if(res.success ==true){
              console.log('hiiiii',res);
            const options = {
              "key": res.key_id,
              "amount": res.order.price,
              "currency": "INR",
              "name": "NovaNex",
              "description": "Test Transaction",
              // "image": "/userSide/images/header/logo.svg",shopping-cart-white
              "image": "img/shopping-cart.png",
              "order_id": res.order.id, //This is a sample Order ID. Pass the id obtained in the response of Step 1
              "callback_url": "/api/onlinePaymentSuccessfull", //after sucessful payment
              "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                  "name": "Samanway S M", 
                  "email": "samanwaysm7@gmail.com",
                  "contact": "9961576447" //Provide the customer's phone number for better conversion rates 
              },
              "notes": {
                  "address": "Razorpay Corporate Office"
              },
              "theme": {
                //   "color": "#3399cc"
                "color": "#8307e4"  
              }
            };
        
            const rzp1 = new Razorpay(options);
        
            rzp1.open();
          }
        })
        .catch(err => {
            console.log(err)
        })
    
        //   document.getElementById('confirmation-popup').style.display = 'none';
      });


    //   <script type="text/javascript">
    $(document).ready(function() {
        $('#redeem-btn').click(function() {
            var couponCode = $('#couponCode').val();
            $.ajax({
                type: 'POST',
                url: '/api/userApplyCoupon',
                data: { couponCode: couponCode },
                success: function(response) {
                    if (response.message) {
                        console.log(response);
                        $('#error-message').html('<p class="error m-0 text-danger">' + response.message + '</p>');
                    } else {
                        // Update the total with the discount if available
                        if (response.discount) {

                            console.log(response.discount);

                            discount(response.discount)

                            // Update the total with discount
                            // var discountedTotal = ( * (1 - response.discount / 100)).toFixed(2);
                            // $('.total-price').text(discountedTotal);
                        }
                    }
                },
                error: function(response) {
                    let {message} = response.responseJSON
                    $('#error-message').html('<p class="error ms-1 text-danger" style="font-size:14px">' + message + '</p>');
                }
            });
        });

        $('#remove-btn').click(function() {
            $.ajax({
                type: 'POST',
                url: '/api/removeCoupon',
                success: function(response) {
                    const a = response.checkoutAmount
                    removed(a)
                    $('#remove-btn').prop('hidden', true);
                    $('#redeem-btn').prop('disabled', false).text('Apply');
                    $('#error-message').empty();
                },
                error: function(err) {
                    console.error(err);
                }
            });
        });
    });
    function discount(a){
       console.log(a,'jkhfgdfd');
       var b=document.getElementById('total-display').innerHTML
       console.log(b);
    //    let k=b*Number(a)/100
        let k = a
        document.getElementById('cop-add').innerText = a
       document.getElementById('total-display').innerText= Math.round(b-k)
       console.log(b*Number(a)/100,'juygfdszkjhgfhx')
       document.getElementById('redeem-btn').disabled = true;
       document.getElementById('redeem-btn').innerText = "Applied"
       document.getElementById('remove-btn').hidden = false;
        $('#error-message').html('<p class="error ms-1 text-success" style="font-size:14px">Coupon Applied</p>');
        document.getElementById('couponApply').hidden = false;
    }
    function removed(x) {
        document.getElementById('total-display').innerText = x;
        document.getElementById('couponCode').value = "";
        $('#error-message').html('<p class="error ms-1 text-danger" style="font-size:14px">Coupon Removed</p>');
        console.log(x)
        document.getElementById('cop-add').innerText = 0
    }
// </script>

