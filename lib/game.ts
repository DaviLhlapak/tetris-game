import Form from "./models/form.js";
import KeyboardListener from "./listeners/keyboard-listener.js";

export interface Game{
    startGame(): void
}

interface GameState{
    isPlaying: boolean,
    forms: Array<Form>,
    velocity: number,
}

interface FormPatern{
    code: number,
    max: number,
    image: string
}


export function createGame(screen: HTMLCanvasElement){

    const formsPatern: Array<FormPatern> = [
        {code:0,max:140,image:"./images/bloco-amarelo.png"},
        {code:1,max:160,image:"./images/bloco-azul.png"},
        {code:2,max:180,image:"./images/bloco-laranja.png"},
        {code:3,max:140,image:"./images/bloco-rosa.png"},
        {code:4,max:160,image:"./images/bloco-roxo.png"},
        {code:5,max:140,image:"./images/bloco-verde.png"},
        {code:6,max:160,image: "./images/bloco-vermelho.png" },
    ];

    const state: GameState = {
        isPlaying: false,
        forms: [],
        velocity: 300,
    };
    
    const keyboard = KeyboardListener(document);

    const context = screen.getContext('2d');
    
    const acceptedMoves = {
        ArrowLeft(form) {
            form.move("left",state.forms);
        },
        ArrowRight(form){
            form.move("right",state.forms);
        },
        ArrowUp(form){
            form.rotate(state.forms)
        }
    }

    

    function generateNumber(max){
        return Math.floor(Math.random() * Math.floor(max+1));
    }

    function update(){
        let form = state.forms[state.forms.length - 1];
        
        let collid = form.isColliding(state.forms);

        if(collid){
            verifyLine();
            
            generateSquare();
        }else{
            form.update()
        }
    }

    function verifyLine(){
        let line;
        let y;

        state.forms.forEach(form1 => {
            form1.squares.forEach(square1 => {
                state.forms.forEach(form2 => {
                    form2.squares.forEach(square2 => {
                        if(square1.y == square2.y){
                            line++;
                        }
                    });
                }); 

            
                if(line == 10){
                    y = square1.y;
                    
                    state.forms.forEach(form => {
                        form.deleteSquare(y);
                    });
                }
    
                line = 0;
            });
        });


    }

    function generateSquare(){

        let piece = generateNumber(formsPatern.length - 1);

        let x = generateNumber(formsPatern[piece].max);

        while (x%20 !== 0) {
            x = generateNumber(formsPatern[piece].max);
        }

        let form = new Form(state.forms.length,x,-20,piece,formsPatern[piece].image);
        form.create();

        state.forms.push(
            form
        );
    }

    function renderScreen(){
        context.clearRect(0,0,screen.width,screen.height)

        state.forms.forEach(elem => {
            elem.draw(context)
        });

        requestAnimationFrame(renderScreen);
    }

    function moveForm(command){
        let form = state.forms[state.forms.length - 1]; 

        const keyPressed = command.keyPressed;
        const moveFunction = acceptedMoves[keyPressed];
       
        if(moveFunction){
            moveFunction(form);
        }

    }

    function startGame(){
        keyboard.subscribe(moveForm)

        state.isPlaying = true;
        generateSquare();

        renderScreen();

        setInterval(update,state.velocity)
    }

    return {
        startGame,
    }
}
