export function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
export function getHurtboxes(f){return f.hurtboxes||[{x:f.x-21,y:f.y-124,w:42,h:122}]}
export function getHurtbox(f){return getHurtboxes(f)[0]}
export function getHitbox(f,a){const h=a.data.hitbox||{x:12,y:-92,w:a.data.reach,h:a.data.height};return{x:f.facing===1?f.x+h.x:f.x-h.x-h.w,y:f.y+h.y,w:h.w,h:h.h}}
