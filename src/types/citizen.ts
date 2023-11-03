export interface Citizen {
  readonly id: number;
  readonly age: number;
  readonly city: string;
  readonly name: string;
  someNote: string;
}

export type AddCitizenForm = Omit<Citizen, "id">;

export type CitizenEvent = Omit<Citizen, "someNote">;
