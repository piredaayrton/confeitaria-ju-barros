export function validates(input) {
  const inputType = input.dataset.type

  if(validators[inputType]) {
    validators[inputType](input)
  }

  if(input.validity.valid) {
    input.parentElement.classList.remove('input__container--invalid')
    input.parentElement.querySelector('.input__message--error').innerHTML = ''
  }else {
    input.parentElement.classList.add('input__container--invalid')
    input.parentElement.querySelector('.input__message--error').innerHTML = displayErrorMessage(inputType, input)
  }
}

const errorTypes = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'customError'
] 

const errorMessages = {
  name: {
    valueMissing: 'O campo nome não pode estar vazio.'
  },
  email: {
    valueMissing: 'O campo de email não pode estar vazio.',
    typeMismatch: 'O email digitado não é valido.'
  },
  password: {
    valueMissing: 'O campo de senha não pode estar vazio.',
    patternMismatch: 'A senha deve conter entre 6 e 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
  },
  birthDate: {
    valueMissing: 'O campo de data de nascimento não pode estar vazio.',
    customError: 'Você deve ser maior de 18 anos para se cadastrar.'
  }
}

const validators = {
  birthDate:input => birthDateValidation(input)
}

function displayErrorMessage(inputType, input) {
  let message = ''
  errorTypes.forEach(error => {
    if(input.validity[error]) {
      message = errorMessages[inputType][error]
    }
  })
  
  return message
}

function birthDateValidation(input) {
  const receivedDate = new Date(input.value);
  let message = "";

  if(!adulthood(receivedDate)) {
    message = 'Você deve ser maior que 18 anos para se cadastrar.'
  }

  input.setCustomValidity(message);
} 

function adulthood(date) {
  const currentDate = new Date();
  const adulthoodDate = new Date(date.getUTCFullYear() + 18, date.getUTCMonth(), date.getUTCDate())

  return adulthoodDate <= currentDate
}