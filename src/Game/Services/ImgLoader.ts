import IImgLoader from './IImgLoader';

class ImgLoader implements IImgLoader {
  constructor() {

  }

  public loadImages(images: string[], onProgress: any, onDone: any, context: any): void {
    console.log("loding: ", images);
    let a = onProgress.bind(context);
    let b = onDone.bind(context);

    a({progress: 100, file: 'unknown.png'});
    b();
  }
}

export default ImgLoader;