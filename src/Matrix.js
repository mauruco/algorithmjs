class Matrix {
    
    /*
        Feedforward Algorithm
        ---------------------
        Weights * Inputs + BIAS -> ACTIVATE()

        input layer                 hidden layer                                   OUTPUT LAYER

        input1 ->                                    GERA WEIGHTS                                                                 GERA WEIGHTS
                    I1, I2, I3 -> Hidden1 [ H1WI1, H1WI2, HWI3] -> forward ACTIVATE( W * I + B) ->
        input2 ->                                                                                   -> Output1 [O1WH1, O1WH2] -> forward ACTIVATE( W * A + B ) -> RESULT
                    I1, I2, I3 -> Hidden2 [ H2WI1, H2WI2, HWI3] -> forward ACTIVATE( W * I + B) ->
        input3 ->
                                                                                     HiddenBias ->
        IBIAS1 ->

        Weights * Inputs + BIAS -> ACTIVATE()
        --                   --   --  --   --                                    --   --      --
        | H1WI1, H1WI2, H1WI3 |   | I1 |   | H1WI1 * I1 + H1WI2 * I2 + H1WI3 * I3 |   | HBIAS1 |
        ----------------------- X ------ = ---------------------------------------- + ----------
        | H2WI1, H2WI2, H2WI3 |   | I2 |   | H2WI1 * I1 + H2WI2 * I2 + H2WI3 * I3 |   | HBIAS2 |
        --                   --   ------   --                                    --   --      --
                                  | I3 |      
                                  --  --

        ACTIVATE = sigmoid( Weights * Inputs + BIAS ) 
        
        ps:
        SIGMOID é a função de ativação, muito comum
        sigmoid = f(x) = 1/(1 + e^-x)
        e (constant) = eulersnumber, naturallogarithmo number = 2.71827




        Error Propagation Algorithm
        ---------------------------

        2 to 1 connection
        -----------------
        Hidden1 -> 0.2 (0.2 é 67% do erro 0.3) | ErrorH1 = (O1WH1/(O1WH1+O1WH2)) * Error1
                                                                                            Out1 [O1WH1, O1WH2] -> (guess) 0.7 | expected = 1.0 | Error1 = expected - guess = 0.3  
        Hidden2 -> 0.1 (0.1 é 33% do erro 0.3) | ErrorH2 = (O1WH2/(O1WH2+O1WH1)) * Error1

        2 to 2 connection
        -----------------
        Hidden1 -> Hidden1Error = (O1WH1/(O1WH1+O1WH2)) * Error1 + (O2WH1/(O2WH1 + O2WH2)) * Error2
                                                                                                       Out1 [O1WH1, O1WH2] -> (guess) 0.7 | expected = 1.0 | Error1 = expected - guess = 0.3
                                                                                                       Out2 [O2WH1, O2WH2] -> (guess) 0.4 | expected = 0.0 | Error2 = expected - guess = -0.4
        Hidden2 -> Hidden2Error = (O1WH2/(O1WH2+O1WH1)) * Error1 + (O2WH2/(O2WH2 + O2WH1)) * Error2

        PS: Não é necessário calcular a proporção, Expl:  ->  Hidden1Error = O1WH1 * Error1 + O2WH1 * Error2 & Hidden2Error = O2WH2 * Error2 + O1WH2 * Error1 

        CONCLUSÃO XD

        A MATRIX DE WEIGTHS É: transpose(weights.matrix) * erros.matrix === HiddenErros (level anterior, acima)
        --            --                --            --    --      --                 --                              --
        | O1WH1, O1WH2 |                | O1WH1, O2WH1 |    | Error1 |                 | O1WH1 * Error1, O2WH1 * Error1 | 
        ----------------  TRANSPOSE ->  ---------------- X  ---------- = HiddenErros = ---------------------------------- 
        | O2WH1, O2WH2 |                | O1WH2, O2WH2 |    | Error2 |                 | O1WH2 * Error2, O2WH2 * Error2 |
        --            --                --            --    --      --                 --                              --

        ----------------------------------------------
        APROXIMÇÃO GRADIENTE ATRVÉS DO ERROS ALGORITMO
        ----------------------------------------------

        lr = learning rate
        LEMBRA y = Mx + B OU EM MATRIX Y =  WI1 * I1 + WI2 * I2 + WI3 * I3 ....

        NO CASO DE
        y = Mx + B
        
        deltaM = lr * x * error;
        deltaB = lr * error;

        --------------
        MATRIX VERSION
        --------------

        Y = sigmoid(W * I + B)

        s'(x) = derivado se sigmoid é clculado  s'(x) = s(x) + (1 - s(x))

        deltaAllWeightsHiddenToOutput.matrix = [ lr(elementwise multiplication) * ErrorOutput(matrix)  *  {s'(x) == (O*(1-O)(elementwise multiplication O e não 0)} ] * transpose(Hidden.matrix( O ouput de hidden ))

        deltaAllWeightsInputToHidden.matrix  = [ lr(elementwise multiplication) * ErrorHidden(matrix)  *  {s'(x) == (H*(1-H)(elementwise multiplication O e não 0)} ] * transpose(Input.matrix( O Input matrix ))
    */

    constructor(rows, cols) {

        this.rows = rows;
        this.cols = cols;
        this.data = this.create(this.rows, this.cols);
    }

    create(rows, cols) {

        let m = [];
        for(let i = 0; i < rows; i++){

            m[i] = [];
            for(let j = 0; j < cols; j++)
                m[i][j] = 0.0;
        }

        return m;
    }

    loopThrough(call) {

        for(let i = 0; i < this.rows; i++)
            for(let j = 0;j < this.cols; j++)
                call(i, j);
    }

    checkMatch(m) {

        if(m.rows !== this.rows || m.cols !== this.cols)
            throw new Error('Matrix do not match!');
    }

    randomize(min = -1, max = 1, floor = false) {

        this.loopThrough((i, j) => {

            this.data[i][j] = floor ? Math.floor(Math.random()*(max-(min)+1)+(min)) : Math.random()*(max-(min)+1)+(min);
        });
    }

    // elementwise multiplication
    // if n is number is a scalar function (Hadamar product)
    multiply(m) {
        
        this.loopThrough((i, j) => {
            
            if(m instanceof Matrix){
                
                this.checkMatch(m);
                this.data[i][j] *= m.data[i][j];
            }else{
                
                this.data[i][j] *= m;
            }
        });
    }
    
    // elementwise addition
    // if n is number is a scalar function
    add(m) {
        
        this.loopThrough((i, j) => {
            
            if(m instanceof Matrix){

                this.checkMatch(m);
                this.data[i][j] += m.data[i][j];
            }else{

                this.data[i][j] += m;
            }
        });
    }

    // Map each element in Matrix
    map(apply) {

        this.loopThrough((i, j) => {

            this.data[i][j] = apply(this.data[i][j], i, j);
        });
    }

    print() {

        if(process.env.NODE_ENV !== 'development')
            return;
        console.log(`ROWS: ${this.rows}, COLS: ${this.cols}`);
        console.table(this.data);
    }

    static map(a, apply) {

        let b = new Matrix(a.rows, a.cols);

        b.loopThrough((i, j) => {

            b.data[i][j] = apply(a.data[i][j], i, j);
        });

        return b;
    }

    static subtract(a, b) {

        let c = new Matrix(a.rows, a.cols);

        c.loopThrough((i, j) => {
            
            if(b instanceof Matrix){

                c.checkMatch(b);
                c.data[i][j] = a.data[i][j] - b.data[i][j];
            }else{

                c.data[i][j] = a.data[i][j] - b;
            }
        });

        return c;
    }

    static toArray(a) {

        return [...a.data];
    }

    static fromArray(arr) {
        
        let a = new Matrix(arr.length, 1);
        a.loopThrough((i, j) => {

            a.data[i][j] = arr[i];
        });
        return a;
    }

    // Transpose
    /*
        De vertical para horizontal
             a | b | c
        M1 = ---------
             d | e | f

        Transposed
             a | d
             -----
        M1 = b | e
             -----
             c | f
    */

    static transpose(a) {

        let b = new Matrix(a.cols, a.rows);

        a.loopThrough((i, j) => {

            b.data[j][i] = a.data[i][j];
        });

        return b;
    }

    // Matrix Product
    // Multiplixcation with other Matrix
    // Attention M1 * M2 !== M2 * M1 (Remember VECTOR DOT PRODUCT)
    // To do Matrix Product M1.COLS ne to be == M2.ROWS
    /*
             a | b | c
        M1 = ---------
             d | e | f


             g | h
             -----
        M2 = i | j
             -----
             k | l

        M1 * M2 =

        a * g + b * i + c * k | a * h + b * j + c * l
        ---------------------------------------------
        d * g + e * i + f * k | d * h + e * j + f * l 


             i0j0 | i0j1 | i0j2
        M1 = ------------------
             i1j0 | i1j1 | i1j2


             i0j0 | i0j1
             -----------
        M2 = i1j0 | i1j1
             -----------
             i2j0 | i2j1

             
        M1 * M2 =
             
        m1(i0j0) * m2(i0j0) + m1(i0j1) * m2(i1j0) + m1(i0j2) * m2(i2j0) | m1(i0j0) * m2(i0j1) + m1(i0j1) * m2(i1j1) + m1(i0j2) * m2(i2j1)
        ---------------------------------------------------------------------------------------------------------------------------------
        m1(i1j0) * m2(i0j0) + m1(i1j1) * m2(i1j0) + m1(i1j2) * m2(i2j0) | m1(i1j0) * m2(i0j1) + m1(i1j1) * m2(i1j1) + m1(i1j2) * m2(i2j1)

    */
    static multiply(a, b) {
        
        if(a.cols !== b.rows){

            console.log(`A COLS: ${a.cols}, B ROWS: ${b.rows}`);
            throw new Error('A Matrix cols do not match B Matrix rows!');
        }

        let c = new Matrix(a.rows, b.cols);

        // return c;

        c.loopThrough((i, j) => {
            
            let sum = 0;
            for(let k = 0; k < a.cols; k++){
    
                sum += a.data[i][k] * b.data[k][j];
            }
            
            c.data[i][j] = sum;
        });

        // for(let i = 0 ; i < c.rows; i++) {
            
        //     for(let j = 0; j < c.cols; j++) {
                
        //         let sum = 0;
        //         console.log(`sum[${i}][${j}] = ${sum}`);
        //         // i = 0
        //         // j = 0
        //         // k = 0
        //         for(let k = 0; k < a.cols; k++){

        //             console.log(`sum = ${sum}, sum += a.data[${i}][${k}] (${a.data[i][k]}) * b.data[${k}][${j}] (${b.data[k][j]})`);
        //             sum += a.data[i][k] * b.data[k][j];
        //         }
                
        //         console.log(`sum[${i}][${j}] = ${sum}`);
        //         c.data[i][j] = sum;
        //     }
        // }

        return c;
    }
}

export default Matrix;