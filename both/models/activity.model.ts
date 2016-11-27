import { CommonEntity } from './common-entity.model';
 
export interface Activity extends CommonEntity {
  status?: string;
  day?: Date;
  people?: number;
  deadline?: Date;
  joined?: number;
}
