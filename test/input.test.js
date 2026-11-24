import test from 'node:test';
import assert from 'node:assert/strict';

const listeners={};
globalThis.window={addEventListener:(name,fn)=>{listeners[name]=fn}};
const {input}=await import('../src/input.js');
const key=(name,type)=>listeners[type]({key:name,preventDefault(){}});

test('P1 and P2 legacy movement and attack controls map correctly',()=>{
 const controls=[['a',1,'left'],['d',1,'right'],['w',1,'jump'],['s',1,'block'],['j',1,'light'],['k',1,'medium'],['l',1,'heavy'],['arrowleft',2,'left'],['arrowright',2,'right'],['arrowup',2,'jump'],['arrowdown',2,'block'],['1',2,'light'],['2',2,'medium'],['3',2,'heavy']];
 for(const [keyName,player,action]of controls){key(keyName,'keydown');const events=input.consume(),state=input.get(player,events);if(['light','medium','heavy'].includes(action))assert(state.commands.some(c=>c.kind===action),`${keyName} maps to P${player} ${action}`);else assert.equal(state[action],true,`${keyName} maps to P${player} ${action}`);key(keyName,'keyup');input.consume();if(!['light','medium','heavy'].includes(action))assert.equal(input.get(player,{pressed:new Set(),released:new Map()})[action],false,`${keyName} releases`)}
});

test('special tap and held ultimate share the original special keys',()=>{
 key('u','keydown');key('u','keyup');assert.equal(input.get(1,input.consume()).commands[0].kind,'special');
 key('4','keydown');key('4','keyup');assert.equal(input.get(2,input.consume()).commands[0].kind,'special');
 assert.equal(input.get(1,{pressed:new Set(),released:new Map([['u',480]])}).commands[0].kind,'ultimate');
 assert.equal(input.get(2,{pressed:new Set(),released:new Map([['4',600]])}).commands[0].kind,'ultimate');
});

test('new awaken, crouch and dodge bindings are available for both players',()=>{
 for(const [button,player,kind]of [['i',1,'awakening'],['5',2,'awakening'],['shift',1,'dodge'],['0',2,'dodge']]){key(button,'keydown');assert(input.get(player,input.consume()).commands.some(c=>c.kind===kind));key(button,'keyup');input.consume()}
 key('c','keydown');assert(input.get(1,{pressed:new Set(),released:new Map()}).crouch);key('c','keyup');key('.','keydown');assert(input.get(2,{pressed:new Set(),released:new Map()}).crouch);key('.','keyup');
});
