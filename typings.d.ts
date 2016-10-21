declare module '*.html' {
  const template: string;
  export default template;
}

declare module '*.scss' {
  export const innerHTML: string;
}

declare module "meteor/jalik:ufs" {
  interface Uploader {
    start: () => void;
  }
 
  interface UploadFS {
    Uploader: (options: any) => Uploader;
  }
 
  export var UploadFS;
}

declare module "gravatar4node" {
   export function getAvatar(email: any, params: any, https: any): any;
}
