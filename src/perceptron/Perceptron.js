class Perceptron {

    // Percptron = Universal function aproximater
    // Um perctron da um peso para cada input
    // Um perctron faz um guess dos inputs, multicando os pesos pelos inputs  e somando (peso.1 * input.1 + peso2 * input2)
    // A função "ativação" converte a resposta para -1 e 1
    // Um perctron treina seus pesos caso sua resposta "guess" foi diferente da resposta certa, até acertar
    // Um pecptron sozinho só é capaz deseparar dados que se literalmente pode separa por uma única linha

    weights = []; // Weight for inp1,  weight for inp2, weight for BIAS
    learningRate = 0.1; // Uma porcentagem de aprendizado, para diminuir a magnetude da diferença do erro pro input 

    // BIAS
    // BIAS serai o terceiro input do perceptron, e ele tem seu peso tambem
    // BIAS PESO é a elevação da linha, acima ou abaixo do 0,0 (inp1 = 0, inp2 = 0)
    // O valor do BIAS será sempre 1!
    // Oq o Perceptron está tentando aprender é a formula a baixo
    /*
                WeightInp1
        inp1 = ------------ * inp2 + WeightBias * 1 (BIAS)
                WeightInp2
    */

    // PQ BIAS?
    // Imagine que input1 = 0 e input2 = 0
    // Se vc multiplicar com os pesos vc recebera logicamente 0, que não seria correto
    // Pq talvez 0,0 está abaixo da usa linha

    constructor(amountWeights = 3) {

        // inizializando weights
        for(let i = 0; i < amountWeights; i++)
            this.weights[i] = Math.random() * 2 -1;
    }

    // Supervise algorith
    // O novopeso = o peso + (delta) || delta é um ajuste calculado do erro para resposta certa ( delta = error * input )
    // Logo esse delta pode ter uma maginetude muito grande, vamos dimuir ela multiplicando com a varavél learningrate 
    // Logo novo peso = peso + (error * input * leraningrate)

    supervisor(error, inputs) {

        // A formula de aprximação
        /*
            new weightInput1 = weightInput1 * input1;
            new weightInput2 = weightInput2 * input2;
            new weightBIAS   = weightBias * BIAS;
        */
        this.weights = this.weights.map((w, i) => {

            w += (error * inputs[i]) * this.learningRate;
            return w;
        });
    }

    // activation function (feed forward)
    sign(sum) {
        
        // >= Lidar com o valo zero
        return sum >= 0 ? 1 : -1;
    }

    // inputs / point = x, y
    guess(inputs) {

        // Sum += Input1 * Weight1 + Input2 * Weight2 + WeightBias * BIAS
        let sum = 0;

        this.weights.map((w, i) => {
            
            sum += inputs[i] * w;
        });

        // Podemos a partir desse calculo criar uma linha aonde o pecptron pensa que esta
        /*
        
            PENSANDO NO CAULCULO

            weightInp1 * input1 + WeightInp2 * input2 + WeightBIAS * BIAS (BIAS === 1) = 0

            LOGOG PODEMOS CALCULAR OS OUTROS

                      - (WeightInp2 * input2) - (WeightBIAS * BIAS)
            input1 =  ----------------------------------------------
                                    weightInput1

            E ASSIM CRIAR UMA LINHA DE AONDE O PERCPTRON PENSA QUE ESTÁ
        */

        let output = this.sign(sum);

        return output;
    }

    guessAndTrain(inputs, correctAnswer) {

        let output = this.guess(inputs);
        
        // if i guess wrong
        if(output !== correctAnswer){
            
            let error = correctAnswer - output; // erro pode ser -2 ou 2. !!ANTENÇÃO: (output - correctAnswer) !=== (correctAnswer - output)
            this.supervisor(error, inputs)
        }

        return output;
    }
}

export default Perceptron;