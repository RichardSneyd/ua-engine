interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
}

export default IImgLoader;