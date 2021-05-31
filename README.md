# Foundry Deobfuscator

More info: http://catnip.fyi/posts/foundry-p1/

Foundryvtt (https://foundryvtt) < 0.8.0 deobfuscator. other javascript-obfuscator (https://www.npmjs.com/package/javascript-obfuscator) projects prolly work as well.

## Usage
> npm start \<path to foundry dist directory\>

dist directory is usually `resources/app/dist` from the foundry base directory.

## Deobfuscating Other Stuff
Foundryvtt is using the npm package [javascript-obfuscator](https://www.npmjs.com/package/javascript-obfuscator)
so this deobfuscator should be able to deobfuscate other projects with a simmilar configuration.
You can also feel free to use this project as a template for you own deobfuscator.
Take a look at [devisit.ts](https://github.com/sum-catnip/foundry-deobfuscator/blob/main/src/devisit.ts),
thats where you overwrite the javascript syntax nodes.
