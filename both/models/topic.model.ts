import { CommonEntity } from './common-entity.model';
 
export interface Topic extends CommonEntity {
  picture?: string;
  pictureId?: string;
  thumb?: string;
  thumbId?: string;
  thumbed?: number;
}
