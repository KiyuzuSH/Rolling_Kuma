const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property
    // 最大速度
    @property
    maxMoveSpeed=0;
    // 加速度
    @property
    accel=0;
    // 加速度方向的开关
    accLeft=false;
    accRight=false;
    accLeftEnemy=false;
    accRightEnemy=false;
    // 水平速度
    xSpeed=0;

    onLoad(){
        this.enabled=false;
        // 初始化键盘输入监听
        this.setInputControl();
    }

    setInputControl(){
        // 添加键盘输入监听以实现跳跃、左转和右转
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        // 触摸输入
        this.node.parent.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }

    onKeyDown(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft=true;
                this.accRight=false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accLeft=false;
                this.accRight=true;
                break;
        }
    }

    onKeyUp(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft=false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight=false;
                break;
        }
    }

    onTouchStart(event){
        var touchLoc=event.getLocation();
        if(touchLoc.x>=cc.winSize.width/2){
            this.accLeft=false;
            this.accRight=true;
        }else{
            this.accLeft=true;
            this.accRight=false;
        }
        // 不要捕捉这个事件
        return true;
    }

    onTouchEnd(){
        this.accLeft=false;
        this.accRight=false;
    }

    getPlayerCenterPos(){
        var pCenterPos=cc.v3(this.node.x+this.node.width/2,this.node.y+this.node.height/2,0);
        return pCenterPos;
    }

    startMoveAt(pos){
        this.enabled=true;
        this.xSpeed=0;
        this.node.setPosition(pos);
    }

    stopMove () {
        this.node.stopAllActions();
    }

    update(dt){
        // 当前有加速度的时候使用加速度
        if(this.accLeft){
            this.xSpeed-=this.accel*dt;
        }else if(this.accRight){
            this.xSpeed+=this.accel*dt;
        }
        if(this.accLeftEnemy){
            this.xSpeed-=this.accel*dt;
        }
        if(this.accRightEnemy){
            this.xSpeed+=this.accel*dt;
        }
        // 限制速度
        if(Math.abs(this.xSpeed)>this.maxMoveSpeed){
            this.xSpeed=this.maxMoveSpeed*this.xSpeed/Math.abs(this.xSpeed);
        }
        // 根据当前速度更新主角位置
        this.node.x+=this.xSpeed*dt;
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.parent.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.parent.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }
}