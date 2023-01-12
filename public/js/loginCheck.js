// const btnLogin = document.querySelector(".login");
// const userId = document.querySelector(".userId");
// const pass = document.querySelector(".passW");

// btnLogin.disabled = "true";

// let f1 = 0,f2 = 0;

// function authUser(){
//     if(userId.value){
//         f1 = 1;
//     }
//     enable();
// }
// function authPass(){
//     if(pass.value){
//         f2 = 1;
//     }
//     enable();
// }

// userId.addEventListener("change", authUser);
// pass.addEventListener("change", authPass);


// function enable(){
//     if(f1 && f2) btnLogin.disabled = "false";
// }

(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()