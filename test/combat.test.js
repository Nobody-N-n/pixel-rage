import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTER_DATA, CHARACTER_ART_STATES } from '../src/characters.js';
import { Fighter } from '../src/fighter.js';
import { activateAwakening, startAttack, updateCombat } from '../src/combat.js';
import { Effects } from '../src/effects.js';
import { getHitbox, getHurtbox, overlaps } from '../src/collision.js';
import { RoundManager } from '../src/roundManager.js';
import { setDifficulty, updateAI } from '../src/ai.js';

const pair=(a='ryken',b='akira')=>[new Fighter(CHARACTER_DATA[a],300,1),new Fighter(CHARACTER_DATA[b],350,2)];
function simulate(a,b,seconds=.9){const fx=new Effects();for(let n=0;n<seconds*60;n++){updateCombat(a,b,1/60,fx);updateCombat(b,a,1/60,fx);fx.update(1/60)}return fx}

test('each grounded attack has distinct frame windows and hitboxes',()=>{
 const [r]=pair(),ranges=[];for(const move of ['light','medium','heavy']){assert.equal(startAttack(r,move),true);ranges.push(r.attack.data.hitbox.w);r.attack=null}assert.equal(new Set(ranges).size,3);assert.equal(activateAwakening(r),false);
});

test('light, medium and heavy connect; medium launches and heavy creates impact effects',()=>{
 for(const move of ['light','medium','heavy']){const [a,b]=pair();assert(startAttack(a,move));const fx=simulate(a,b,.65);assert(b.health<100,`${move} should hit`);assert(a.damageDealt>0);if(move==='medium')assert.equal(b.onGround,false);if(move==='heavy')assert(fx.wavesCreated>0)}
});

test('Akira has distinct fast normals, slash, special and ultimate properties',()=>{
 for(const move of ['light','medium','heavy','special','ultimate']){const [a,b]=pair('akira','ryken');a.energy=100;assert(startAttack(a,move));assert(a.attack.data.name);assert(a.attack.data.hitbox.w>0);const result=simulate(a,b,.9);assert(b.health<100,`${move} should connect`);if(move==='special'||move==='ultimate')assert(result.wavesCreated>0)}
});

test('Akira light is a two-hit string and cancel windows permit a buffered launcher',()=>{
 const [a,b]=pair('akira','ryken');assert(startAttack(a,'light'));simulate(a,b,.24);assert.equal(a.combo,2);assert(a.attack?.hit);assert(a.cancelWindow>0);assert(startAttack(a,'medium'));assert.equal(a.attack.kind,'medium');
});

test('input buffering holds a chain command briefly and executes it inside the cancel window',()=>{
 const [a,b]=pair();assert(startAttack(a,'light'));a.queueCommand('medium');simulate(a,b,.17);a.ageCommandBuffer(.17);assert.equal(a.inputBuffer[0].kind,'medium');assert(startAttack(a,a.inputBuffer[0].kind));a.inputBuffer.shift();assert.equal(a.attack.kind,'medium');a.queueCommand('heavy');a.ageCommandBuffer(.4);assert.equal(a.inputBuffer.length,0);
});

test('air attacks use aerial hitboxes, and launchers allow air-chase follow-ups',()=>{
 const [a,b]=pair();b.y=375;b.onGround=false;b.vy=-190;b.updateHurtboxes();assert(startAttack(a,'medium'));simulate(a,b,.45);assert(b.airHits>0||b.hitstun>0);a.onGround=false;a.y=350;a.updateHurtboxes();assert(startAttack(a,'heavy'));assert.equal(a.attack.data.name,'METEOR FINISH');
});

test('special, ultimate, awakening duration, and awakening buffs are gated by energy',()=>{
 const [r]=pair();assert.equal(startAttack(r,'special'),false);r.energy=50;assert(startAttack(r,'special'));assert.equal(r.energy,0);r.attack=null;r.energy=99;assert.equal(startAttack(r,'ultimate'),false);r.energy=100;assert(startAttack(r,'ultimate'));assert.equal(r.energy,0);r.attack=null;r.energy=100;assert(activateAwakening(r));assert.equal(r.awake,9);assert.equal(r.energy,0);assert(startAttack(r,'heavy'));assert(r.attack.data.damage>18);
});

test('combo damage scales down and guarded attacks use their own collision window',()=>{
 const [a,b]=pair(),damage=[];for(let i=0;i<4;i++){a.attack=null;const before=b.health;assert(startAttack(a,'light'));simulate(a,b,.34);damage.push(before-b.health)}assert(damage[3]<damage[0]);assert(a.damageDealt>0);
 const [attacker,guard]=pair();guard.blocking=true;guard.facing=-1;assert(startAttack(attacker,'heavy'));simulate(attacker,guard,.5);assert(guard.health<100&&guard.health>90);assert(overlaps(getHitbox({x:attacker.x,y:attacker.y,facing:1},attacker.attack||{data:{hitbox:{x:8,y:-86,w:76,h:61}}}),getHurtbox(guard)));
});

test('all AI difficulties approach, defend or attack under combat conditions',()=>{
 for(const difficulty of ['easy','normal','hard']){setDifficulty(difficulty);const [cpu,human]=pair('akira','ryken');let acted=false;for(let i=0;i<1600;i++){const d=updateAI(cpu,human,1/60);acted||=!!(d.left||d.right||d.block||d.jump||d.commands?.length)}assert(acted,difficulty)}
});

test('best-of-three countdown, draw replay, and two-win match completion',()=>{
 const round=new RoundManager(),[a,b]=pair();round.start();for(let i=0;i<181;i++)round.update(1/60,a,b);assert.equal(round.state,'fight');round.time=.01;round.update(.02,a,b);assert.equal(round.state,'between');assert.deepEqual(round.wins,[0,0]);round.delay=0;round.update(.02,a,b);for(let i=0;i<181;i++)round.update(1/60,a,b);a.health=100;b.health=0;round.update(1/60,a,b);assert.equal(round.wins[0],1);round.delay=0;round.update(.02,a,b);for(let i=0;i<181;i++)round.update(1/60,a,b);a.health=100;b.health=0;assert.equal(round.update(1/60,a,b),'over');assert.equal(round.result,'RYKEN WINS');
});

test('pixel-art character atlas defines every requested animation state',()=>{
 for(const state of ['idle','walk','run','jump','fall','crouch','block','dodge','lightAttack','mediumAttack','heavyAttack','aerialAttack','hitReaction','knockback','stun','special','ultimate','awakening','victory','defeat'])assert(CHARACTER_ART_STATES.includes(state),state);
});
