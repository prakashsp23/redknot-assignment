import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PersonalInfoFormData, EducationFormData, ProjectsFormData, Project, FormData } from '@/types';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface FormContextType {
  formData: FormData;
  updatePersonalInfo: (data: PersonalInfoFormData) => Promise<void>;
  updateEducation: (data: EducationFormData) => Promise<void>;
  updateProjects: (data: ProjectsFormData) => Promise<void>;
  addProject: () => void;
  removeProject: (id: string) => void;
  loading: boolean;
  submitForm: () => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Create the initial empty form data
const initialFormData: FormData = {
  name: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipcode: '',
  isStudying: false,
  institution: '',
  projects: [],
};

const API_URL = 'http://localhost:3001/api';

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // console.log('FormProvider - Current user:', user);
  // console.log('FormProvider - Current formData:', formData);
  // console.log('FormProvider - Current submissionId:', submissionId);

  // Load existing data on first render
  useEffect(() => {
    const fetchFormData = async () => {
      if (!user) {
        // console.log('FormProvider - No user found, skipping data fetch');
        return;
      }

      try {
        // console.log('FormProvider - Fetching form data for user:', user.id);
        setLoading(true);
        const response = await axios.get(`${API_URL}/form`, {
          params: { userId: user.id }
        });
        // console.log('FormProvider - Received form data:', response.data);
        if (response.data) {
          // Ensure all form fields are properly initialized
          const loadedData = {
            ...initialFormData,
            ...response.data,
            projects: response.data.projects || [],
          };
          // console.log('FormProvider - Setting form data:', loadedData);
          setFormData(loadedData);
          setSubmissionId(response.data.id);
        }
      } catch (error) {
        // console.error('FormProvider - Error fetching form data:', error);
        toast.error("Error fetching form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [user]);

  const updatePersonalInfo = async (data: PersonalInfoFormData) => {
    if (!user) {
      // console.error('FormProvider - No user found when updating personal info');
      throw new Error('User not authenticated');
    }

    try {
      // console.log('FormProvider - Updating personal info:', data);
      setLoading(true);
      const response = await axios.post(`${API_URL}/form/personal`, {
        ...data,
        id: submissionId,
        userId: user.id
      });
      // console.log('FormProvider - Personal info update response:', response.data);

      setFormData((prev) => ({ ...prev, ...data }));
      setSubmissionId(response.data.id);
    } catch (error) {
      // console.error('FormProvider - Error saving personal info:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (data: EducationFormData) => {
    if (!user) {
      // console.error('FormProvider - No user found when updating education');
      throw new Error('User not authenticated');
    }

    try {
      // console.log('FormProvider - Updating education with data:', data);
      setLoading(true);

      // If isStudying is false, don't send institution field at all
      const educationData = data.isStudying
        ? { isStudying: data.isStudying, institution: data.institution }
        : { isStudying: data.isStudying };

      // console.log('FormProvider - Sending education data to server:', {
      //   ...educationData,
      //   id: submissionId,
      //   userId: user.id
      // });

      const response = await axios.post(`${API_URL}/form/education`, {
        ...educationData,
        id: submissionId,
        userId: user.id
      });

      // console.log('FormProvider - Education update response:', response.data);

      setFormData((prev) => ({ ...prev, ...educationData }));
      setSubmissionId(response.data.id);
    } catch (error) {
      // console.error('FormProvider - Error saving education info:', error);
      if (axios.isAxiosError(error)) {
        // console.error('FormProvider - Server response:', error.response?.data);
        // console.error('FormProvider - Request data:', error.config?.data);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProjects = async (data: ProjectsFormData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/form/projects`, {
        ...data,
        id: submissionId,
        userId: user.id
      });

      setFormData((prev) => ({ ...prev, ...data }));
      setSubmissionId(response.data.id);
    } catch (error) {
      // console.error('Error saving projects:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: '',
      description: '',
    };

    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const removeProject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  };

  const submitForm = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      await axios.post(`${API_URL}/form/submit`, {
        ...formData,
        id: submissionId,
        userId: user.id
      });
    } catch (error) {
      // console.error('Error submitting form:', error);
      toast.error("Error submitting form. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updatePersonalInfo,
        updateEducation,
        updateProjects,
        addProject,
        removeProject,
        loading,
        submitForm,
        setFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};