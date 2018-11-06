import Matrix from '../Matrix';

class NeuralNetwork {

    constructor(inputs, hiddens, outputs, learningRate = 0.1) {

        this.inputs = inputs;
        this.hiddens = hiddens;
        this.outputs = outputs;
        this.weightsHiddensGiveToInputs = new Matrix(this.hiddens, this.inputs);
        this.weightsOutputsGiveToHiddens = new Matrix(this.outputs, this.hiddens);
        this.weightsHiddensGiveToInputs.randomize();
        this.weightsOutputsGiveToHiddens.randomize();
        this.biasH = new Matrix(this.hiddens, 1);
        this.biasO = new Matrix(this.outputs, 1);
        // should bias not be > 0 ?
        this.biasH.randomize(0, 1);
        this.biasO.randomize(0, 1);
        this.learningRate = learningRate;
    }

    sigmoid(x) {

        return 1/(1 + Math.exp(-x));
    }

    diveredSigmoid(x) {

        // real sigmoid
        // return this.sigmoid(x) * (1 - this.sigmoid(x));
        // if x is already sigmoid
        return x * (1 - x);
    }

    predict(inputsArray, toArray = true) {
     
        let outsOut = this.feedforward(inputsArray);
        return toArray ? Matrix.toArray(outsOut) : outsOut;
    }

    feedforward(inputsArray) {

        // generate hiddens ouputs
        let inputs = Matrix.fromArray(inputsArray);
        let hiddensOut = Matrix.multiply(this.weightsHiddensGiveToInputs, inputs);
        // ads bias
        hiddensOut.add(this.biasH);
        // activation function
        hiddensOut.map(this.sigmoid);
        
        // generate ouputs
        let outsOut = Matrix.multiply(this.weightsOutputsGiveToHiddens, hiddensOut);
        outsOut.add(this.biasO);
        // activation function
        outsOut.map(this.sigmoid);

        return outsOut;
    }

    train(inputsArray, targetsArray, toArray = true) {

        // generate hiddens ouputs
        let inputs = Matrix.fromArray(inputsArray);
        let hiddensOut = Matrix.multiply(this.weightsHiddensGiveToInputs, inputs);
        // ads bias
        hiddensOut.add(this.biasH);
        // activation function
        hiddensOut.map(this.sigmoid);
        
        // generate ouputs
        let outsOut = Matrix.multiply(this.weightsOutputsGiveToHiddens, hiddensOut);
        outsOut.add(this.biasO);
        // activation function
        outsOut.map(this.sigmoid);

        // comparando guess com resposta
        let answers = Matrix.fromArray(targetsArray);
        let outErrors = Matrix.subtract(answers, outsOut);
        
        // calculate gradientes de ajuste
        // deltaAllWeightsHiddenToOutput.matrix = [ lr(elementwise multiplication) * ErrorOutput(matrix)  *  {s'(x) == (O*(1-O)(elementwise multiplication O e não 0)} ] * transpose(Hidden.matrix( O ouput de hiddens ))
        let gradients = Matrix.map(outsOut, this.diveredSigmoid); // Copy off outputs    // *  {s'(x) == (O*(1-O)(elementwise multiplication O e não 0)}
        
        gradients.multiply(outErrors);                                                   // * ErrorOutput(matrix)
        gradients.multiply(this.learningRate);                                           // * lr(elementwise multiplication)
        
        // BIAS OUT
        this.biasO.add(gradients);
        
        // calculate deltas
        let hiddensTransposed = Matrix.transpose(hiddensOut);
        let deltaHiddensToOutputs = Matrix.multiply(gradients, hiddensTransposed);       // * transpose(Hidden.matrix( O ouput de hiddens )
        
        // calculando hiddenslayers erros
        let weightsOutputsGiveToHiddensTransposed = Matrix.transpose(this.weightsOutputsGiveToHiddens);
        let hiddensErros = Matrix.multiply(weightsOutputsGiveToHiddensTransposed, outErrors);

        
        // gradientes de hiddens
        let Hgradients = Matrix.map(hiddensOut, this.diveredSigmoid);
        Hgradients.multiply(hiddensErros);
        Hgradients.multiply(this.learningRate);
        
        // BIAS Hidden
        this.biasH.add(Hgradients);
        
        // inputs to hidden deltas
        let inputsTranposed = Matrix.transpose(inputs);
        
        // Hgradients.print();
        // inputsTranposed.print();
        let deltaInputsToHiddens = Matrix.multiply(Hgradients, inputsTranposed);
        
        // finalmente ajustando os weights
        this.weightsOutputsGiveToHiddens.add(deltaHiddensToOutputs);
        this.weightsHiddensGiveToInputs.add(deltaInputsToHiddens);

        return toArray ? Matrix.toArray(outsOut) : outsOut;
    }
}

export default NeuralNetwork;