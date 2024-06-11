export enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Other = "Other",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface FormFields {
  firstName: string;
  lastName: string;
  motherName: string;
  fatherName: string;
  pincode: string;
  // address: string;
  maritalStatus: MaritalStatus | "";
  gender: Gender | "";
  dob: string;
  maidenName: string;
}
