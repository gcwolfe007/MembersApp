export interface IResults {
  results: Array<IMember>;
}
export interface IMember {
  gender: string;
  name: IPersonName | null;
  location: ILocation;
  email: string;
  login: ILogin;
  dob: IDob;
  registered: IRegistered;
  phone: string;
  cell: string;
  id: IId;
  picture: IPicture;
  nat: string;
}

export interface IPersonName {
  title: string;
  first: string;
  last: string;
}

export interface ILocation {
  street: IStreet;
  city: string;
  state: string;
  country: string;
  postcode: number | string;
  coordinates: ICoordinates;
  timezone: ITimeZone;
}

export interface IStreet {
  number: number;
  name: string;
}

export interface ICoordinates {
  latitude: string;
  longitude: string;
}

export interface ITimeZone {
  offset: string;
  description: string;
}

export interface ILogin {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export interface IDob {
  date: string;
  age: number;
}

export interface IRegistered {
  date: string;
  age: number;
}

export interface IId {
  name: string;
  value: string | null;
}

export interface IPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface MemberResolved {
 member: IMember;
 error?: any;
}
