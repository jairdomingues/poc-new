import {Deserializable} from '../../../shared/interfaces/deserializable.interface';

export class Hero implements Deserializable {
  id: string;
  name: string;
  likes: number;
  default: boolean;
  order: string;
	orderStatus: string;
	salesOrganization: string;
	distributionChannel: string;
	organizationDivision: string;
	soldToParty: string;
	customerNumber: string;

  constructor(hero: any = {}) {
    this.id = hero.id;
    this.name = hero.name || '';
    this.likes = hero.likes || 0;
    this.default = hero.default || false;
    this.order = hero.order || '';
    this.orderStatus = hero.orderStatus || '';
    this.salesOrganization = hero.salesOrganization || '';
    this.distributionChannel = hero.distributionChannel || '';
    this.organizationDivision = hero.organizationDivision || '';
    this.soldToParty = hero.soldToParty || '';
    this.customerNumber = hero.customerNumber || '';

  }

  like() {
    this.likes += 1;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
