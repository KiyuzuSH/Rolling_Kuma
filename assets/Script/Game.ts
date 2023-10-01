import Player from "./Player";
import EnemyL from "./EnemyL";
import EnemyR from "./EnemyR";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(Player)
    player:Player=null;

    @property(cc.Node)
    title:cc.Node=null;
    @property(cc.Node)
    thing:cc.Node=null;
    @property(cc.Node)
    todo:cc.Node=null;
    @property(cc.Node)
    btnStart:cc.Node=null;
    @property(cc.Node)
    rail:cc.Node=null;
    @property(cc.Node)
    btnRetry:cc.Node=null;
    @property(cc.Node)
    btnReturn:cc.Node=null;
    @property(cc.Node)
    btnThing:cc.Node=null;
    @property(cc.Node)
    btnTodo:cc.Node=null;
    @property(cc.Node)
    btnHome:cc.Node=null;
    @property(cc.Node)
    gameOverNode:cc.Node=null;

    @property(cc.Animation)
    railAnimation:cc.Animation=null;
    @property(cc.Animation)
    rolling:cc.Animation=null;
    @property(cc.Animation)
    turning:cc.Animation=null;
    @property(cc.Animation)
    byon:cc.Animation=null;


    @property(cc.Prefab)
    leftSlab:cc.Prefab=null;
    @property(cc.Prefab)
    rightSlab:cc.Prefab=null;

    // private
    playing=false;
    leftTimer=0;
    rightTimer=0;
    leftDuration=0;
    rightDuration=0;

    onLoad(){
        this.firstPage();
    }

    firstPage(){
        this.player.node.active=false;
        this.btnStart.active=true;
        this.title.active=true;
        this.btnRetry.active=false;
        this.btnReturn.active=false;
        this.btnThing.active=true;
        this.thing.active=false;
        this.btnTodo.active=true;
        this.todo.active=false;
        this.btnHome.active=false;
        this.gameOverNode.active=false;
        this.rail.active=false;
    }

    gamePage(){
        var turnAnim=this.turning.getComponent(cc.Animation);
        turnAnim.stop();
        this.playing=true;
        this.player.node.active=true;
        this.player.node.opacity=255;
        this.btnStart.active=false;
        this.title.active=false;
        this.btnRetry.active=false;
        this.btnReturn.active=false;
        this.btnThing.active=false;
        this.thing.active=false;
        this.btnTodo.active=false;
        this.todo.active=false;
        this.btnHome.active=false;
        this.gameOverNode.active=false;
        this.rail.active=true;
    }

    thingPage(){
        this.playing=false;
        this.player.node.active=false;
        this.btnStart.active=false;
        this.title.active=true;
        this.btnRetry.active=false;
        this.btnReturn.active=false;
        this.btnThing.active=false;
        this.thing.active=true;
        this.btnTodo.active=false;
        this.todo.active=false;
        this.btnHome.active=true;
        this.gameOverNode.active=false;
        this.rail.active=false;
    }

    todoPage(){
        this.playing=false;
        this.player.node.active=false;
        this.btnStart.active=false;
        this.title.active=true;
        this.btnRetry.active=false;
        this.btnReturn.active=false;
        this.btnThing.active=false;
        this.thing.active=false;
        this.btnTodo.active=false;
        this.todo.active=true;
        this.btnHome.active=true;
        this.gameOverNode.active=false;
        this.rail.active=false;
    }

    gameOverLeft(){
        this.playing=false;
        var rollAnim=this.rolling.getComponent(cc.Animation);
        rollAnim.stop('KumaNormal');
        var turnAnim=this.turning.getComponent(cc.Animation);
        turnAnim.play('KumaTurnLeft');
        this.player.stopMove();
        this.btnStart.active=false;
        this.title.active=false;
        this.btnRetry.active=true;
        this.btnReturn.active=true;
        this.gameOverNode.active=true;
        this.rail.active=true;
    }

    gameOverRight(){
        this.playing=false;
        var rollAnim=this.rolling.getComponent(cc.Animation);
        rollAnim.stop('KumaNormal');
        var turnAnim=this.turning.getComponent(cc.Animation);
        turnAnim.play('KumaTurnRight');
        this.player.stopMove();
        this.btnStart.active=false;
        this.title.active=false;
        this.btnRetry.active=true;
        this.btnReturn.active=true;
        this.gameOverNode.active=true;
        this.rail.active=true;
    }

    onStartGame(){
        this.gamePage();
        // 小熊开始运动
        this.player.startMoveAt(cc.v2(0,-400));
        var rollAnim=this.rolling.getComponent(cc.Animation);
        rollAnim.playAdditive('KumaNormal');
    }

    spawnLeftSlab(){
        var newLeft= cc.instantiate(this.leftSlab);
        this.node.addChild(newLeft);
        newLeft.getComponent(EnemyL).init(this,this.player);
    }

    spawnRightSlab(){
        var newRight= cc.instantiate(this.rightSlab);
        this.node.addChild(newRight);
        newRight.getComponent(EnemyR).init(this,this.player);
    }

    startLeftTimer(){
        this.leftDuration=Math.random()*15;
        this.leftTimer=0;
        return;
    }

    startRightTimer(){;
        this.rightDuration=Math.random()*15;
        this.rightTimer=0;
        return;
    }

    update(dt){
        if(!this.playing) return;
        if(this.player.node.x<-270){
            this.gameOverLeft();
            return;
        }
        if(this.player.node.x>270){
            this.gameOverRight();
            return;
        }
        this.leftTimer+=dt;
        this.rightTimer+=dt;

        if(this.leftTimer>this.leftDuration){
            this.spawnLeftSlab();
            this.startLeftTimer()
        }

        if(this.rightTimer>this.rightDuration){
            this.spawnRightSlab();
            this.startRightTimer();
        }
    }
}