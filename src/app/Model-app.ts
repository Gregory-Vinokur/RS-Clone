import { Lang } from '../constans/constans';
import { TypeUser } from '../constans/types';
import Model from '../pages/Template/Model';

export default class ModelApp extends Model {
  constructor(lang: Lang, user: TypeUser) {
    super(lang, user);
  }
}
