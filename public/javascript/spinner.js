const btn = document.getElementById("btnNew")
const spinner = document.getElementById("spinner")
const body = document.getElementById("newSheet")

btn.addEventListener("click",()=>{
    body.style.opacity = 0.2
    spinner.style.display = "block"
})