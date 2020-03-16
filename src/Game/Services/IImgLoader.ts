interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
  loadSpine(name: string, jsonUrl: string): void;
  download(onDone?: Function): void;
}

export default IImgLoader;