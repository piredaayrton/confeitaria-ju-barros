const control = document.querySelectorAll("[data-control]")

control.forEach( (element) => {
  element.addEventListener("click", (event => {
    manipulateAmount(event.target.dataset.control, event.target.parentNode)
  }))
})

function manipulateAmount(operation, control) {
  const amount = control.querySelector("[data-counter]")

  if(operation === "-" && amount.value > 0) {
    amount.value = parseInt(amount.value) - 1
  }
  if(operation === "+"){
    amount.value = parseInt(amount.value) + 1
  }
}