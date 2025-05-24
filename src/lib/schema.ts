import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  addressLine1: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters' }),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Please enter a valid zipcode' }),
});

// Education Schema
export const educationSchema = z.object({
  isStudying: z.boolean(),
  institution: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.isStudying === true) {
      return data.institution && data.institution.length >= 2;
    }
    return true;
  },
  {
    message: 'Institution name must be at least 2 characters when currently studying',
    path: ['institution'],
  }
);

// Project Schema
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
});

export const projectsSchema = z.object({
  projects: z.array(projectSchema).min(1, { message: 'Please add at least one project' }),
});

// Combined Form Schema
export const formSchema = z.object({
  ...personalInfoSchema.shape,
  isStudying: z.boolean(),
  institution: z.string().optional().nullable(),
  ...projectsSchema.shape,
}).refine(
  (data) => {
    if (data.isStudying === true) {
      return data.institution && data.institution.length >= 2;
    }
    return true;
  },
  {
    message: 'Institution name must be at least 2 characters when currently studying',
    path: ['institution'],
  }
);

export type PersonalInfoSchemaType = z.infer<typeof personalInfoSchema>;
export type EducationSchemaType = z.infer<typeof educationSchema>;
export type ProjectSchemaType = z.infer<typeof projectSchema>;
export type ProjectsSchemaType = z.infer<typeof projectsSchema>;
export type FormSchemaType = z.infer<typeof formSchema>;