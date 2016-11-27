import { CommonEntity } from './common-entity.model';
 
export interface House extends CommonEntity {
  type?: string;
  forRental?: boolean;
  brief?: string;
  floorPlan?: string;
  area?: number;
  acess?: string;
  built?: number;
  price?: number;
  picture?: string;
  pictureId?: string;
  thumb?: string;
  thumbId?: string;
  pictures?: Array<string>;
  thumbs?: Array<string>;
}
