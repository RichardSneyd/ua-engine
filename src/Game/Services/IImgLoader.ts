interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
  download(): void;
}

export default IImgLoader;