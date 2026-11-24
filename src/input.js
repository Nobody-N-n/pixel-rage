const keys=new Set(),pressed=new Set(),released=new Map(),heldSince=new Map();
const keyName=e=>e.key.length===1?e.key.toLowerCase():e.key.toLowerCase();
window.addEventListener('keydown',e=>{const k=keyName(e);if(['arrowup','arrowdown','arrowleft','arrowright',' ','escape'].includes(k))e.preventDefault();if(!keys.has(k)){pressed.add(k);heldSince.set(k,performance.now())}keys.add(k)});
window.addEventListener('keyup',e=>{const k=keyName(e),started=heldSince.get(k);if(keys.has(k))released.set(k,Math.max(0,performance.now()-(started??performance.now())));keys.delete(k);heldSince.delete(k)});
window.addEventListener('blur',()=>{keys.clear();pressed.clear();released.clear();heldSince.clear()});
export const input={
 consume(){const events={pressed:new Set(pressed),released:new Map(released)};pressed.clear();released.clear();return events},
 get(player,events){const one=player===1,map=one?{left:'a',right:'d',jump:'w',block:'s',blockAlt:'q',crouch:'c',evade:'shift',light:'j',medium:'k',heavy:'l',special:'u',awaken:'i'}:{left:'arrowleft',right:'arrowright',jump:'arrowup',block:'arrowdown',blockAlt:'/',crouch:'.',evade:'0',light:'1',medium:'2',heavy:'3',special:'4',awaken:'5'};const commands=[];for(const k of ['light','medium','heavy','evade','awaken'])if(events.pressed.has(map[k]))commands.push({kind:k==='evade'?'dodge':k==='awaken'?'awakening':k});const specialHold=events.released.get(map.special);if(specialHold!==undefined)commands.push({kind:specialHold>=480?'ultimate':'special'});const moving=keys.has(map.left)||keys.has(map.right),held=Math.max(heldSince.get(map.left)===undefined?0:performance.now()-heldSince.get(map.left),heldSince.get(map.right)===undefined?0:performance.now()-heldSince.get(map.right));return{left:keys.has(map.left),right:keys.has(map.right),jump:events.pressed.has(map.jump),block:keys.has(map.block)||keys.has(map.blockAlt),crouch:keys.has(map.crouch),run:moving&&held>360,commands}},
 isDown(k){return keys.has(k.toLowerCase())}
};
