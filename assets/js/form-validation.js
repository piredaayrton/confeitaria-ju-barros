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
    input.parentElement.querySelector('.input__message--error').innerHTML = getErrorMessage(inputType, input)
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
  },
  cpf: {
    valueMissing: 'O campo de CPF não pode estar vazio.',
    customError: 'O CPF digitado não é valido.'
  },
  cep: {
    valueMissing: 'O campo de CEP não pode estar vazio.',
    patternMismatch: 'O CEP digitado não é válido.',
    customError: 'Não foi possível buscar o CEP.'
  },
  publicPlace: {
    valueMissing: 'O campo de logradouro não pode estar vazio.'
  },
  city: {
    valueMissing: 'O campo de cidade não pode estar vazio.'
  },
  state: {
    valueMissing: 'O campo de estado não pode estar vazio.'
  }
}

const validators = {
  birthDate: input => birthDateValidation(input),
  cpf: input => validatesCpf(input),
  cep: input => recoverCep(input)
}

function getErrorMessage(inputType, input) {
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
  const adulthoodThresholdInYears = 18
  const fullYear = date.getUTCFullYear() + adulthoodThresholdInYears
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  const currentDate = new Date();
  const adulthoodDate = new Date(fullYear, month, day)

  return adulthoodDate <= currentDate
}

function validatesCpf(input) {
  const formattedCpf = input.value.replace(/\D/g, '')
  let message = ''

  if(!checkRepeatedCpf(formattedCpf) || !checkCpfStructure(formattedCpf)) {
    message = 'O CPF digitado não é valido.'
  }

  input.setCustomValidity(message)
}

function checkRepeatedCpf(cpf) {
  const repeatedValues = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
  ]
  let validCpf = true

  repeatedValues.forEach(value => {
    if(value == cpf) {
      validCpf = false
    }
  })

  return validCpf
}

function checkCpfStructure(cpf) {
  const multiplier = 10

  return checkDigitChecker(cpf, multiplier)
}

function checkDigitChecker(cpf, multiplier) {
  if(multiplier >= 12) {
    return true
  }

  let initialMultiplier = multiplier
  let sum = 0
  const cpfWithoutDigits = cpf.substr(0, multiplier - 1).split('')
  const digitChecker = cpf.charAt(multiplier - 1)

  for(let i = 0; initialMultiplier > 1; initialMultiplier--) {
    sum = sum + cpfWithoutDigits[i] * initialMultiplier
    i++
  }

  if(digitChecker == confirmDigit(sum)) {
    return checkDigitChecker(cpf, multiplier + 1)
  }

  return false
}

function confirmDigit(sum) {
  return 11 - (sum % 11)
}

function recoverCep(input) {
  const cep = input.value.replace(/\D/g, '')
  const url = `https://viacep.com.br/ws/${cep}/json`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }

  if(!input.validity.patternMismatch && !input.validity.valueMissing) {
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        if(data.error) {
          input.setCustomValidity('Não foi possível buscar o CEP.')
          return
        }

        input.setCustomValidity('')
        fillFieldsWithCep(data)
      }
    )
  }
}

function fillFieldsWithCep(data) {
  const publicPlace = document.querySelector('[data-type="publicPlace"]')
  const city = document.querySelector('[data-type="city"]')
  const state = document.querySelector('[data-type="state"]')

  publicPlace.value = data.logradouro
  city.value = data.localidade
  state.value = data.uf
}