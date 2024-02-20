// const categoryName = document.getElementById('categoryName');
// const form = document.getElementById('form');
// const errorElement1 = document.getElementById('errorElement1');

// form.addEventListener('submit', (e) => {
//         let categoryNameErrMessage = [];

//         if (categoryName.value === '') {
//                 categoryNameErrMessage.push("Category Name is Required");
//         }

//         if (categoryNameErrMessage.length > 0) {
//                 e.preventDefault();
//                 errorElement1.innerText = categoryNameErrMessage.join(', ');
//         } else {
//                 form.submit();
//         }
// });

const categoryName = document.getElementById('categoryName');
const imageInput = document.getElementById('imageInput');

const form = document.getElementById('form');
const errorElement1 = document.getElementById('errorElement1');

form.addEventListener('submit', (e) => {
    let categoryNameErrMessage = [];
    let imageNameErrMessage = [];

    if (categoryName.value.trim() === '') {
        categoryNameErrMessage.push("Category Name is Required");
    }

    // if (imageInput.value === '') {
    //     imageNameErrMessage.push("Category Name is Required");
    // }
    if (imageInput.value !== '') {
        const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
        const fileName = imageInput.value.toLowerCase();
        const fileExtension = fileName.split('.').pop();
    
        if (!allowedExtensions.includes(fileExtension)) {
            imageNameErrMessage.push("Invalid file format. Please select a valid image (jpg, jpeg, png, gif)");
        }
    }

    if (categoryNameErrMessage.length > 0) {
        e.preventDefault();
        errorElement1.innerText = categoryNameErrMessage.join(', ');
    } else {
        form.submit();
    }
});

