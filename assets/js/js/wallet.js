
    document.getElementById('addMoney').addEventListener('click', function(event) {
        console.log("abcd")
        event.preventDefault()
        console.log($('#walletAddForm').serialize());
        $.ajax({           
          url: '/api/addWallet',
          data: $('#walletAddForm').serialize(),
          type: "POST"
        })
        .then(res => {
            console.log(res.paymentMethod)
            if(res.err){
                return location.href = res.url;
            }
        
            if(res.success ==true){
              console.log('hiiiii',res);
            const options = {
              "key": res.key_id,
              "amount": res.wallet.amount,
              "currency": "INR",
              "name": "NovaNex",
              "description": "Test Transaction",
              // "image": "/userSide/images/header/logo.svg",
              "order_id": res.wallet.id, //This is a sample Order ID. Pass the id obtained in the response of Step 1
              "callback_url": "/api/addWalletPaymentSuccessfull", //after sucessful payment
              "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                  "name": "Samanway S M", 
                  "email": "samanwaysm7@gmail.com",
                  "contact": "9961576447" //Provide the customer's phone number for better conversion rates 
              },
              "notes": {
                  "address": "Razorpay Corporate Office"
              },
              "theme": {
                  // "color": "#3399cc"
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