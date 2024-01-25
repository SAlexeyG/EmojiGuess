import { _decorator, Component, Node, Layout, view, director, screen, Widget, WorldNode3DToLocalNodeUI, ParticleSystem2D, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LayoutAdaptation')
export class LayoutAdaptation extends Component {
    @property(Node)
    winPanel: Node;

    @property(ParticleSystem2D)
    particles: ParticleSystem2D[] = [];

    onLoad() {
        this.prepareLayout();
        view.on('canvas-resize', () => { this.prepareLayout(); });
    }

    prepareLayout() {
        let grid = this.getComponent(Layout);

        let width = screen.windowSize.x;
        let height = screen.windowSize.y;

        let widthRatio = view.getDesignResolutionSize().x / width;
        let heightRatio = view.getDesignResolutionSize().y / height;

        let widget = this.getComponent(Widget);
        let scaleRatio: number;

        if (width > height) {
            grid.type = 1;
            scaleRatio = heightRatio;
            grid.spacingX = width / height * 100;
            widget.editorHorizontalCenter = -200;
        }
        else {
            grid.type = 2;
            scaleRatio = widthRatio * 0.8;
            grid.spacingY = width / height * 100;
            widget.editorVerticalCenter = 400;
        }

        this.node.setScale(this.node.getScale().multiplyScalar(scaleRatio));
        this.winPanel.setScale(this.winPanel.getScale().multiplyScalar(scaleRatio));

        for (var i of this.particles) {
            i.startSize *= widthRatio * 0.8;
            i.startSizeVar *= widthRatio * 0.8;
            i.posVar = i.posVar.multiplyScalar(widthRatio * 0.8);
        }
    }
}



