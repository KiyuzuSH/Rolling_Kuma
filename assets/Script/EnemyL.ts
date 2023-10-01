const {ccclass, property} = cc._decorator;
import Kuma from "./Player";

@ccclass
export default class Enemy extends cc.Component {
    game=null;
    player=null;

    onLoad(){
        this.enabled=false;
    }

    init(game,player){
        this.game=game;
        this.player=player;
        this.enabled=true;
        this.node.opacity=255;
        this.node.setPosition(cc.v2(-270,800));
    }
    

    getPlayerDistance(){
        var playerPos=this.player.getComponent(Kuma).getPlayerCenterPos();
        var dist=this.node.position.sub(playerPos).mag();
        return dist;
    }

    update(dt){
        // 每秒移动
        this.node.y-=8;
        if(this.node.y<-800){
            this.destroy();
        }
        if(this.getPlayerDistance()<150){
            this.player.accRightEnemy=true;
            this.player.accLeftEnemy=false;
        }else{this.player.accRightEnemy=false;}
    }
}
