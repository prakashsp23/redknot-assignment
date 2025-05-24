// Form submission types
export type PersonalInfoFormData = {
  name: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipcode: string;
};

export type EducationFormData = {
  isStudying: boolean;
  institution?: string | null;
};

export type Project = {
  id: string;
  name: string;
  description: string;
};

export type ProjectsFormData = {
  projects: Project[];
};

export type FormData = PersonalInfoFormData & EducationFormData & ProjectsFormData;