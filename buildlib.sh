tsc --declaration --target ES2016
dts-bundle --name UAENGINE --main src/Game/UAENGINE.d.ts
cp src/Game/UAENGINE.d.ts dist/UAENGINE.d.ts
