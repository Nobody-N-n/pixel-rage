import{drawFighterArt}from'./characters.js';export function drawFighter(ctx,f,frame){const kind=f.attack&&f.attack.time>=f.attack.data.start*.5?f.attack.kind:null;drawFighterArt(ctx,f,frame,kind)}
