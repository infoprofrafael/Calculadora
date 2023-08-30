class CalculadoraController {
    constructor() {
        //atributo da nossa classe
        // this.data = "27/08";
        // this.hora = "23:04";
        // document.querySelector(".data").innerHTML = this.data;
        // document.querySelector(".hora").innerHTML = this.hora;
        this.dataEl = document.querySelector(".data");
        this.horaEl = document.querySelector(".hora");
        this._displayEl = document.querySelector(".expressao");
        this._listaExpressao = ['0'];
        this.iniciar();
        this.initAddEventsKeyboard();
        this.initAddEventosBotoes();
        this._ifResult = false;
    }

    iniciar() {
        this.attData();
        setInterval(() => {
            this.attData();
        }, 1000);
    }


    inverse() {
        if (this.verifSeOperador(this.retornaUltimo())) {
            this._listaExpressao.pop();
        }
        if (this.retornaUltimo() == '0') {
            return;
        }
        this._listaExpressao[this._listaExpressao.length - 1] = (1 / this.retornaUltimo()).toString();
        this._ifResult = true;
        this.attDisplay();



    }


    //Criando um método
    attData() {
        let data = new Date();

        this.dataEl.innerHTML = data.toLocaleDateString('pt-BR');
        this.horaEl.innerHTML = data.toLocaleTimeString('pt-BR');
    }
    attDisplay() {
        //Método para aparecer no display do HTML
        this._displayEl.innerHTML = this._listaExpressao.join('');
        //método join separação entre os elementos de uma lista
        //serve para atualizar o display
        this._displayEl.scrollBy(100, 0);
        

    }

    clear() {
        this._listaExpressao = ['0'];
        this.attDisplay();

    }

    apagar() {
        this._listaExpressao[this._listaExpressao.length - 1] = this.retornaUltimo().slice(0, -1);
        if (this.retornaUltimo() == '') {
            if (this._listaExpressao.length == 1) {
                this._listaExpressao = ['0'];
            } else {
                this._listaExpressao.pop();
            }

        }

        this.attDisplay();

    }

    error(){
        this._displayEl.innerHTML = 'ERROR';
    }




    retornaUltimo() {
        return this._listaExpressao[this._listaExpressao.length - 1];
    }

    verifSeOperador(val) {
        return ['÷', '+', '-', '×'].indexOf(val) > -1;
    }

    addValoresExpressao(val) {
        if (this.verifSeOperador(val)) {
            //Se não for número
            //metodo push serve para adicionar algo no final
            if (this.verifSeOperador(this.retornaUltimo())) {
                this._listaExpressao[this._listaExpressao.length - 1] = val;
            } else {
                this._listaExpressao.push(val);
            }

        } else {
            //Se for número
            //add o núemro no último index da lista
            if (this.verifSeOperador(this.retornaUltimo())) {
                this._listaExpressao.push(val);
            } else {
                if (this.retornaUltimo() == '0' && val.toString() != '.') {
                    this._listaExpressao[this._listaExpressao.length - 1] = '';
                }
                if (this.retornaUltimo().indexOf('.') > -1 && val.toString() == '.') {
                    return;
                }
                this._listaExpressao[this._listaExpressao.length - 1] += val.toString();

            }
           
        }
        
        console.log(this._listaExpressao);
        
        this.attDisplay();
     
    }

    multiindexOf(arrPrinc, arr) {
        for (let i = 0; i < arrPrinc.length; i++) {
            let v = arrPrinc[i];
            for (let i2 = 0; i2 < arr.length; i2++) {
                let v2 = arr[i2];
                if (v == v2) {
                    return [i, v2];
                }
            }
        }
        return [-1, ''];

    }


    calculate() {
        //Método dos resultados
        for (let i = 0; i < this._listaExpressao.length; i += 2) {
            this._listaExpressao[i] = parseFloat(this._listaExpressao[i]);
        }

        //console.log(this._listaExpressao);
        while (this.multiindexOf(this._listaExpressao, ['÷', '×'])[0] > -1) {
            let operation = this.multiindexOf(this._listaExpressao, ['÷', '×']);
            let result;
            switch (operation[1]) {
                case '÷':
                    result = this._listaExpressao[operation[0] - 1] / this._listaExpressao[operation[0] + 1];
                    break;
                case '×':
                    result = this._listaExpressao[operation[0] - 1] * this._listaExpressao[operation[0] + 1];
            }
            this._listaExpressao.splice(operation[0]-1,3,result);
        }
        while (this.multiindexOf(this._listaExpressao, ['+', '-'])[0] > -1) {
            let operation = this.multiindexOf(this._listaExpressao, ['+', '-']);
            let result;
            switch (operation[1]) {
                case '+':
                    result = this._listaExpressao[operation[0] - 1] + this._listaExpressao[operation[0] + 1];
                    break;
                case '-':
                    result = this._listaExpressao[operation[0] - 1] - this._listaExpressao[operation[0] + 1];
            }
            this._listaExpressao.splice(operation[0]-1,3,result);
        }
        //apresentando o resultado no display do html
        this._ifResult = true;
        this._listaExpressao[0] = this._listaExpressao[0].toString();
        this.attDisplay();

    }

    calcPrev(){
        //Falto fazer

    }

    initAddEventsKeyboard(){
        document.addEventListener('keyup',(e)=>{
            console.log(e.key);

            switch (e.key) {
                case 'Escape':
                    this.clear();
                    //limpar tudo
                    break;
                case 'Backspace':
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.apagar();
                    //apagar último caractere
                    break;
                case 'Enter':
                    //Calcula o valor final
                    this.calculate();
                    break;
                case '*':
                case '+':
                case '-':
                case '/':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                case '.':
                    if(this._ifResult == true){
                        this.clear();
                        this._ifResult = false;
                    }
                    this.addValoresExpressao(e.key);
                    break;
            }
            this.calcPrev();
            if(isNaN(this._listaExpressao[0])){
                this.error();
            }

        });
    }


    initAddEventosBotoes() {
        let botoes = document.querySelectorAll('table.botoes td');

        botoes.forEach(botao => {
            botao.addEventListener('click', () => {
                let valor = botao.innerHTML;

                switch (valor) {
                    case 'AC':
                        this.clear();
                        //limpar tudo
                        break;
                    case 'backspace':
                        if(this._ifResult == true){
                            this.clear();
                            this._ifResult = false;
                        }
                        this.apagar();
                        //apagar último caractere
                        break;
                    case '=':
                        //Calcula o valor final
                        this.calculate();
                        break;
                    case '1/x':
                        //inverte último valor digitado
                        this.inverse();
                        break;
                    case '×':
                    case '+':
                    case '-':
                    case '÷':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':
                    case '.':
                        if(this._ifResult == true){
                            this.clear();
                            this._ifResult = false;
                        }
                        this.addValoresExpressao(valor);
                        break;
                }
                this.calcPrev();
                if(isNaN(this._listaExpressao[0])){
                    this.error();
                }

            })

        });


    }



}