import { _decorator, Component, Node, Button, Label, Sprite, randomRange, randomRangeInt, log, CCString, labelAssembler, tween, Vec2, Vec3, quat, Quat, Tween, TERRAIN_WEST_INDEX, ParticleSystem2D, TERRAIN_HEIGHT_BASE, ParticleSystem } from 'cc';
import { Guess } from './Guess';
const { ccclass, property } = _decorator;

@ccclass('UIMediator')
export class UIMediator extends Component {
    @property(Guess)
    guesses: Guess;

    @property(Sprite)
    picture: Sprite;

    @property(Label)
    rightAnswers: Label[] = [];

    @property(Button)
    userAnswers: Button[] = [];

    @property({type : CCString})
    allAnswers: string[] = [];

    @property({ type: CCString })
    wrongAnswer: string;

    @property(Sprite)
    stars: Sprite[] = [];

    @property(Node)
    winPanel: Node;

    @property(Button)
    nextButton: Button;

    private shakeMotion: Tween<Node> = tween().repeat(3, tween()
        .to(0.1, { angle: 10 }, { easing: "sineInOut" })
        .to(0.1, { angle: -10 }, { easing: "sineInOut" }))
        .to(0.1, { angle: 0 }, { easing: "sineInOut" });

    start() {
        this.clearUI();
        this.setupPicture();
        this.setupUserAnswers();
    }

    changeGuess() {
        this.guesses.nextGuess();
        this.clearUI();
        this.setupPicture();
        this.setupUserAnswers();
    }

    setupUserAnswers() {
        let remainedUserAnswers: Button[] = [];
        for (var y of this.userAnswers) {
            remainedUserAnswers.push(y);
        }

        for (var i of this.guesses.getAnswers()) {
            let index: number = randomRangeInt(0, remainedUserAnswers.length);
            remainedUserAnswers[index].getComponentInChildren(Label).string = i;
            remainedUserAnswers.splice(index, 1);
        }

        let remainedAnswers: string[] = [];
        for (var o of this.allAnswers) {
            if (!this.guesses.checkAnswer(o))
                remainedAnswers.push(o);
        }

        for (var t of remainedUserAnswers) {
            let index: number = randomRangeInt(0, remainedAnswers.length);
            t.getComponentInChildren(Label).string = remainedAnswers[index];
            remainedAnswers.splice(index, 1); 
        }
    }

    setupPicture() {
        this.picture.spriteFrame = this.guesses.getPicture();
    }

    clearUI() {
        this.picture.spriteFrame = null;
        
        for (var i of this.userAnswers) {
            i.getComponentInChildren(Label).string = "";
            i.enabled = true;
        }

        for (var t of this.rightAnswers) {
            t.string = "";
        }

        this.winPanel.active = false;
    }

    checkAnswer(event: Event, customEventData: string) {
        const node: Node = event.target;
        const button: Button = node.getComponent(Button);
        const label: Label = button.getComponentsInChildren(Label)[0];

        button.enabled = false;

        if (this.guesses.checkAnswer(label.string)) this.showRighAnswer(label); 
        else this.showWrongAnswer(label); 
    }

    showWinPanel() {
        for (var i of this.stars) {
            i.node.setScale(0, 0);
        }

        this.nextButton.node.setScale(0, 0);

        this.winPanel.active = true;

        const smallStar: Vec3 = new Vec3(0.07, 0.07, 0.07);
        const bigStar: Vec3 = new Vec3(0.1, 0.1, 0.1);

        tween(this.stars[0].node)
            .to(0.1, { scale: smallStar }, { easing: "sineInOut" })
            .call(() => {
                this.stars[0].getComponentInChildren(ParticleSystem2D).resetSystem();
                tween(this.stars[1].node)
                    .to(0.1, { scale: bigStar }, { easing: "sineInOut" })
                    .call(() => {
                        this.stars[1].getComponentInChildren(ParticleSystem2D).resetSystem();
                        tween(this.stars[2].node)
                            .to(0.1, { scale: smallStar }, { easing: "sineInOut" })
                            .call(() => {
                                this.stars[2].getComponentInChildren(ParticleSystem2D).resetSystem()
                                tween(this.nextButton.node)
                                    .to(0.1, { scale: new Vec3(1, 1, 1) })
                                    .start();
                            }).start();
                    }).start();
            }).start();
    }

    showRighAnswer(label: Label) {
        var i = 0;
        for (; i < this.rightAnswers.length; i++) {
            if (this.rightAnswers[i].string === "") {
                this.rightAnswers[i].string = label.string;
                break;
            }
        } 

        label.string = "";
        tween(this.rightAnswers[i].node)
            .call(() => {
                this.rightAnswers[i].node.getComponentInChildren(ParticleSystem2D).resetSystem();
            })
            .then(this.shakeMotion)
            .call(() => {
                if (i === this.rightAnswers.length - 1) this.showWinPanel(); 
            })
            .start();
    }

    showWrongAnswer(label: Label) {
        label.node.setScale(0, 0);
        label.string = this.wrongAnswer;
        tween(label.node)
            .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: "sineInOut" })
            .then(this.shakeMotion)
            .to(0.1, { scale: new Vec3(0, 0, 0) }, { easing: "sineInOut" })
            .call(() => {
                label.string = "";
                label.node.setScale(1, 1);
            })
            .start();
    }
}


