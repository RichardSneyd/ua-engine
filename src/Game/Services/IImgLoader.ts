interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
  loadSpine(name: string, jsonUrl: string): void;
  download(): void;
}

export default IImgLoader;