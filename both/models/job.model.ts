import { CommonEntity } from './common-entity.model';
 
export interface Job extends CommonEntity {
  location?: string;
  position?: string;
  people?: number;
  start?: Date;
}
