import { Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider } from '@/context/FormContext';
import { PersonalInfoForm } from '@/components/PersonalInfoForm';
import { EducationForm } from '@/components/EducationForm';
import { ProjectsForm } from '@/components/ProjectsForm';
import { Toaster } from "@/components/ui/sonner"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Button } from './components/ui/button';

function App() {
  return (
    <>
      <header className="fixed top-0 right-0 p-4 z-50">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <SignedIn>
        <FormProvider>
          <div className="h-full flex items-center justify-center w-screen">
            <Routes>
              <Route path="/" element={<PersonalInfoForm />} />
              <Route path="/education" element={<EducationForm />} />
              <Route path="/projects" element={<ProjectsForm />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </FormProvider>
      </SignedIn>
      <SignedOut>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to the Form Application</h1>
            <p className="text-xl mb-4">Please sign in to continue</p>
            <div className="flex gap-2 justify-center items-center" >
            <Button>
              <SignInButton />
            </Button>
            <Button variant="outline">
              <SignUpButton />
            </Button>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

export default App;