interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
  download(onDone?: Function): void;
}

export default IImgLoader;