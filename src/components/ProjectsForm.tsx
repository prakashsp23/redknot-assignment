import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { projectsSchema, ProjectsSchemaType } from "@/lib/schema";
import { useFormContext } from "@/context/FormContext";
import { FormContainer } from "@/components/FormContainer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function ProjectsForm() {
  const { formData, updateProjects, addProject, removeProject, loading, submitForm } = useFormContext();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  const form = useForm<ProjectsSchemaType>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: [{
        id: uuidv4(),
        name: '',
        description: ''
      }],
    },
  });

  // One-time initialization with context data
  useEffect(() => {
    if (!initialized && formData.projects.length > 0) {
      form.reset({ projects: formData.projects });
      setInitialized(true);
    }
  }, [formData.projects, initialized]);

  const onSubmit = async (data: ProjectsSchemaType) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Please fix validation errors");
        return;
      }

      await updateProjects(data);
      await submitForm();
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error("Error submitting form");
      // console.error("Submission error:", error);
    }
  };

  const handleAddProject = () => {
    const currentProjects = form.getValues().projects;
    const newProject = {
      id: uuidv4(),
      name: '',
      description: ''
    };

    // Optimistically update form first
    form.setValue("projects", [...currentProjects, newProject], {
      shouldValidate: false,
      shouldDirty: true
    });

    // Then update context
    //@ts-ignore
    addProject(newProject);
  };

  const handleRemoveProject = (index: number) => {
    const currentProjects = form.getValues().projects;

    if (currentProjects.length <= 1) {
      toast.info("You need to keep at least one project");
      return;
    }

    const projectId = currentProjects[index]?.id;
    if (!projectId) return;

    // Optimistically update form first
    const updatedProjects = currentProjects.filter((_, i) => i !== index);
    form.setValue("projects", updatedProjects);

    // Then update context
    removeProject(projectId);
  };

  // Get current projects from form state for rendering
  const projectsToRender = form.watch("projects");

  return (
    <FormContainer
      title="Projects"
      description="Please provide information about your projects."
      currentStep={3}
    >
      <Card className="w-full">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {projectsToRender.map((project, index) => (
                <Card key={project.id} className="relative border-2 bg-card">
                  <CardContent className="pt-6">
                    {projectsToRender.length > 1 && (
                      <div className="absolute right-4 top-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProject(index)}
                          className="hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Project {index + 1}
                    </h3>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My Awesome Project"
                                {...field}
                                onBlur={() => form.trigger(`projects.${index}.name`)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your project..."
                                rows={3}
                                {...field}
                                onBlur={() => form.trigger(`projects.${index}.description`)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddProject}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Project
              </Button>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/education")}
                  disabled={loading}
                >
                  Previous
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </FormContainer>
  );
} 