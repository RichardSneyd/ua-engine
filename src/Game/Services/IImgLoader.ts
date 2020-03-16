interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
  loadSpine(name: string, jsonUrl: string): void;
  download(): void;
  getResources(foo: Function): void;
  getTexture(resource: any, frame: any): any;
}

export default IImgLoader;