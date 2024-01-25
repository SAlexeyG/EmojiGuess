import { _decorator, Component, Node, resources, SpriteFrame, randomRangeInt, CCString } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('tpl')
class tpl {
    @property({ type: SpriteFrame })
    picture: SpriteFrame;

    @property({ type: CCString})
    answers: string[] = [];
}

@ccclass('Guess')
export class Guess extends Component {
    @property({ type: tpl })
    private guesses: tpl[] = [];

    private remainedGuesses : tpl[] = []
    private currentGuess: tpl;
    
    onLoad() {
        for (var i of this.guesses) {
            this.remainedGuesses.push(i);
        }
        this.nextGuess();
    }

    nextGuess() {
        if (this.remainedGuesses.length === 0) {
            for (var i of this.guesses) {
                this.remainedGuesses.push(i);
            }
        } 

        let index: number = randomRangeInt(0, this.remainedGuesses.length);
        this.currentGuess = this.remainedGuesses[index];
        this.remainedGuesses.splice(index, 1);
    }

    getAnswers(): string[] {
        return this.currentGuess.answers;
    }

    getPicture(): SpriteFrame {
        return this.currentGuess.picture;
    }

    checkAnswer(answer : string) {
        for (var i of this.currentGuess.answers) {
            if (i === answer) return true;
        }

        return false;
    }
}


