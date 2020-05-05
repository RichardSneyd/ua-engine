tsc --declaration --target es2015 --outDir js/types
dts-bundle --name UAENGINE --main js/types/Game/UAENGINE.d.ts
cp js/types/Game/UAENGINE.d.ts build/UAENGINE.d.ts
rm -rf js/types
