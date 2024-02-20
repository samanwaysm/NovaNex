const productName = document.getElementById('productName');
const brandName = document.getElementById('brandName');
const subTitle = document.getElementById('subTitle');
const descriptionHeading = document.getElementById('descriptionHeading');
const description = document.getElementById('description');
const firstPrice = document.getElementById('firstprice');
const lastPrice = document.getElementById('lastprice');
const discount = document.getElementById('discount');
const color = document.getElementById('color');
const inStock = document.getElementById('inStock');
const image = document.getElementById('image');
const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');
const errorElement4 = document.getElementById('errorElement4');
const errorElement5 = document.getElementById('errorElement5');
const errorElement6 = document.getElementById('errorElement6');
const errorElement7 = document.getElementById('errorElement7');
const errorElement8 = document.getElementById('errorElement8');
const errorElement9 = document.getElementById('errorElement9');
const errorElement10 = document.getElementById('errorElement10');
const errorElement11 = document.getElementById('errorElement11');
const errorElement12 = document.getElementById('errorElement12');

form.addEventListener('submit', (e) => {
        // e.preventDefault();
        console.log(productName,brandName,subTitle);
        let productNameErrMessage = [];
        let brandNameErrMessage = [];
        let subTitleErrMessage = [];
        let descriptionHeadingErrMessage = [];
        let descriptionErrMessage = [];
        let firstPriceErrMessage = [];
        let lastPriceErrMessage = [];
        let discountErrMessage = [];
        let colorErrMessage = [];
        let inStockErrMessage = [];


        // if (productName.value === '') {
        //         productNameErrMessage.push("Product Name is Required");
        // }

        if (productName.value.trim() === '') {
                productNameErrMessage.push("Product Name is Required");
        }

        if (brandName.value.trim() === '') {
                brandNameErrMessage.push("Brand Name is Required");
        }

        if (subTitle.value.trim() === '') {
                subTitleErrMessage.push("subTitle is Required");
        }

        if (descriptionHeading.value.trim() === '') {
                descriptionHeadingErrMessage.push("Heading is Required");
        }

        if (description.value.trim() === '') {
                descriptionErrMessage.push("description is Required");
        }

        if (firstPrice.value.trim() === '') {
                firstPriceErrMessage.push("FirstPrice is Required");
        }else if (parseFloat(firstPrice.value) < 0) {
                firstPriceErrMessage.push("First Price cannot be negative");            
        }

        if (lastPrice.value.trim() === '') {
                lastPriceErrMessage.push("Last Price is Required");
            } else if (parseFloat(lastPrice.value) < 0) {
                lastPriceErrMessage.push("Last Price cannot be negative");
            } else if (parseFloat(lastPrice.value) > parseFloat(firstPrice.value)) {
                lastPriceErrMessage.push("Last Price cannot be less than First Price");
            }

        if (discount.value.trim() === '') {
                discountErrMessage.push("discount is Required");
        }
        if (color.value.trim() === '') {
                colorErrMessage.push("color is Required");
        }

        if (inStock.value.trim() === '') {
                inStockErrMessage.push("Stock is Required");
        }else if (parseFloat(inStock.value) < 0) {
                inStockErrMessage.push("Stock cannot be negative");
        }

        if (productNameErrMessage.length > 0 || brandNameErrMessage.length > 0 || subTitleErrMessage.length > 0 || descriptionHeadingErrMessage.length > 0 || descriptionErrMessage.length > 0 || firstPriceErrMessage.length > 0 || lastPriceErrMessage.length > 0 || discountErrMessage.length > 0 || colorErrMessage.length > 0 || inStockErrMessage.length > 0) {
                e.preventDefault();
                errorElement1.innerText = productNameErrMessage.join(', ');
                errorElement2.innerText = brandNameErrMessage.join(', ');
                errorElement4.innerText = subTitleErrMessage.join(', ');
                errorElement5.innerText = descriptionHeadingErrMessage.join(', ');
                errorElement6.innerText = descriptionErrMessage.join(', ');
                errorElement7.innerText = firstPriceErrMessage.join(', ');
                errorElement8.innerText = lastPriceErrMessage.join(', ');
                errorElement9.innerText = discountErrMessage.join(', ');
                errorElement10.innerText = colorErrMessage.join(', ');
                errorElement11.innerText = inStockErrMessage.join(', ');
        } else {
                form.submit();
        }
});