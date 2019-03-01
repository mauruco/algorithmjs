const args = process.argv.slice(2);
let min = parseInt(args[0]);
let max = parseInt(args[1]);
let length = parseInt(args[2]);

// verifanco args
if(args.length < 3 || length < 2 || min >= max){
  
  min = 1;
  max = 25;
  length = 50;
  console.log('Argumentos não compatíveis. Utilizando argumentos default.');
}

console.log('Algoritmo começa em 3 segundos.');

const rand = (min, max) => {

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// gerando array com Valores aleatórios
let rands = [];

for(let i = 0; i < length; i++)
  rands.push(rand(min, max));

// transformando o array em algo visível no console
const display = () => {

  console.clear();

  for(let i = max; i >= min; i--){
  
    let str = '';
    
    rands.map((item) => {
  
      if(i > item) {
        
        return str = str + ' ';
      }
      
      str = str + '|';
    });
  
    console.log(str);
  }
};

// lógica de sort alg
const walk = (first, second, steps) => {

  let temp = null;
  
  // se comparei o primeiro elemento até o últimoe elemento e ele não e maior, então o alg chgou  ao fim
  if(steps - 1 === length)
  return {first, second, steps, success: true};
  
  // se o segundo elemento é maior que o tal dee elementos, então reinicio
  if(second > length)
    return {first: 0, second: 1, steps: 1};

  // walk
  if(rands[first] > rands[second]) {

    temp = rands[second];
    rands[second] = rands[first];
    rands[first] = temp;
    return {first: second, second: second + 1, steps: 1};
  }

  // se primeio elemento não é maior que o segundo, primeiro elemento vira segundo
  return {first: second, second: second + 1, steps: ++steps};
};

// game loop
const loop = (startFirst, startSecond, startSteps) => {

  display();

  let {first, second, steps, success} = walk(startFirst, startSecond, startSteps);

  if(success) return console.log('SUCCESS');

  setTimeout(() => {

    loop(first, second, steps);
  }, 10);
};

setTimeout(() => {

  loop(0, 1, 1);
}, 3000);
