export class Fighter{
 constructor(character,x,player){this.character=character;this.x=x;this.y=423;this.vx=this.vy=0;this.player=player;this.facing=player===1?1:-1;this.health=100;this.energy=0;this.onGround=true;this.crouching=false;this.blocking=false;this.attack=null;this.hitstun=0;this.invuln=0;this.evade=0;this.combo=0;this.comboTimer=0;this.comboReceived=0;this.comboReceiveTimer=0;this.wins=0;this.animFrame=0;this.animTime=0;this.state='idle';this.running=false;this.inputBuffer=[];this.cancelWindow=0;this.cancelCount=0;this.damageDealt=0;this.lastMove='';this.hitFlash=0;this.awake=0;this.awakeningTime=0;this.awakenCooldown=0;this.aiThink=0;this.aiCommandId=0;this.airHits=0;this.updateHurtboxes()}
 updateHurtboxes(){const crouch=this.crouching&&!this.onGround?false:this.crouching;this.hurtboxes=[{x:this.x-(crouch?23:21),y:this.y-(crouch?76:124),w:crouch?46:42,h:crouch?75:122}]}
 queueCommand(kind,life=.38){if(this.inputBuffer.length>=5)this.inputBuffer.shift();this.inputBuffer.push({kind,time:life})}
 ageCommandBuffer(dt){for(const command of this.inputBuffer)command.time-=dt;this.inputBuffer=this.inputBuffer.filter(command=>command.time>0)}
 get canAct(){return!this.attack&&this.hitstun<=0&&this.evade<=0}
}
