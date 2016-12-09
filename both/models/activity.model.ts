import { CommonEntity } from './common-entity.model';
 
export interface Activity extends CommonEntity {
  status?: string;
  day?: string;
  people?: number;
  deadline?: string;
  joined?: number;
}
