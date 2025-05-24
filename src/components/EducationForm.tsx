import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { educationSchema, EducationSchemaType } from "@/lib/schema";
import { useFormContext } from "@/context/FormContext";
import { FormContainer } from "@/components/FormContainer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, School } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function EducationForm() {
  const { formData, updateEducation, loading } = useFormContext();
  const navigate = useNavigate();

  const form = useForm<EducationSchemaType>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      isStudying: formData.isStudying ?? false,
      institution: formData.institution || "",
    },
  });

  // Update form values when formData changes
  useEffect(() => {
    form.reset({
      isStudying: formData.isStudying ?? false,
      institution: formData.institution || "",
    });
  }, [formData, form]);

  const watchIsStudying = form.watch("isStudying");

  useEffect(() => {
    if (!watchIsStudying) {
      form.setValue('institution', null);
    }
  }, [watchIsStudying, form]);

  const onSubmit = async (data: EducationSchemaType) => {
    try {
      await updateEducation(data);
      // toast.success("Education information saved successfully");
      navigate("/projects");
    } catch (error) {
      // console.error("Error submitting education info:", error);
      toast.error("Failed to save education information. Please try again.");
    }
  };

  return (
    <FormContainer
      title="Educational Status"
      description="Please provide information about your educational status."
      currentStep={2}
    >
      <Card className="w-full">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="isStudying"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Educational Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          const boolValue = value === "true";
                          field.onChange(boolValue);
                          if (!boolValue) {
                            form.setValue('institution', null);
                          }
                        }}
                        value={field.value.toString()}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes, I am still studying
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No, I have completed my education
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchIsStudying && (
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-300 ease-in-out">
                      <FormLabel className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        Where are you studying?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University or Institution name"
                          {...field}
                          value={field.value || ''}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={loading}
                  className="h-10"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-32 h-10 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </FormContainer>
  );
}