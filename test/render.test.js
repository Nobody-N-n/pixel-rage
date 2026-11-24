import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTER_DATA, CHARACTER_ART_STATES, drawFighterArt, drawCharacterPortrait } from '../src/characters.js';
import { Fighter } from '../src/fighter.js';
import { startAttack, activateAwakening } from '../src/combat.js';

function context(){return{fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},save(){},restore(){},translate(){},scale(){},drawImage(){this.draws=(this.draws||0)+1},createLinearGradient(){return{addColorStop(){}}}}}

test('both locally generated sprite atlases render every combat pose and portraits',()=>{
 const fake=context();globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context()})};
 for(const character of Object.values(CHARACTER_DATA)){const f=new Fighter(character,300,1);drawFighterArt(fake,f,0);f.vx=45;drawFighterArt(fake,f,8);f.vx=270;drawFighterArt(fake,f,16);f.onGround=false;f.vy=-120;drawFighterArt(fake,f,20);f.vy=180;drawFighterArt(fake,f,24);f.onGround=true;f.crouching=true;drawFighterArt(fake,f,28);f.blocking=true;drawFighterArt(fake,f,32);f.blocking=false;f.evade=.2;drawFighterArt(fake,f,36);f.evade=0;for(const kind of ['light','medium','heavy','special','ultimate']){f.onGround=kind!=='light';f.energy=100;startAttack(f,kind);drawFighterArt(fake,f,40);f.attack=null}f.onGround=false;startAttack(f,'heavy');drawFighterArt(fake,f,44);f.attack=null;f.hitstun=.7;f.vx=220;drawFighterArt(fake,f,48);f.hitstun=0;f.vx=0;f.awake=9;f.awakeningTime=.7;activateAwakening({...f,canAct:true});drawFighterArt(fake,f,52);f.resultPose='win';drawFighterArt(fake,f,56);f.resultPose='lose';drawFighterArt(fake,f,60);const portrait=context();drawCharacterPortrait(portrait,character);assert(portrait.draws>0);assert(fake.draws>=15)}
 for(const state of CHARACTER_ART_STATES)assert(typeof state==='string'&&state.length>0);
});
