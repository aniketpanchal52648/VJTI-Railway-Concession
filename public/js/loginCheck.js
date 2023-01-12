const btnLogin = document.querySelector(".login-primary");
const userId = document.querySelector(".userId");
const pass = document.querySelector(".pass");




btnLogin.addEventListener("click", () => {
    const userData = userId.value;
    const password = pass.value;

    if(!userData || !password){
        if(!userData){
            userId.style.border = "2px solid red";
            
            setInterval(() => {
                userId.style.border = "1px solid black";
            }, 2000);

        } else {
            pass.style.border = "2px solid red";

            setInterval(() => {
                pass.style.border = "1px solid black";
            }, 2000);
            
        }
    } else {
        window.location.href = "/application.ejs";
    }

});