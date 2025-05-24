import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { personalInfoSchema, PersonalInfoSchemaType } from "@/lib/schema";
import { useFormContext } from "@/context/FormContext";
import { FormContainer } from "@/components/FormContainer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User, Mail, MapPin, Building2, Map } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function PersonalInfoForm() {
  const { formData, updatePersonalInfo, loading } = useFormContext();
  const navigate = useNavigate();

  const form = useForm<PersonalInfoSchemaType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      addressLine1: formData.addressLine1 || "",
      addressLine2: formData.addressLine2 || "",
      city: formData.city || "",
      state: formData.state || "",
      zipcode: formData.zipcode || "",
    },
  });

  // Update form values when formData changes
  useEffect(() => {
    form.reset({
      name: formData.name || "",
      email: formData.email || "",
      addressLine1: formData.addressLine1 || "",
      addressLine2: formData.addressLine2 || "",
      city: formData.city || "",
      state: formData.state || "",
      zipcode: formData.zipcode || "",
    });
  }, [formData, form]);

  const onSubmit = async (data: PersonalInfoSchemaType) => {
    try {
      await updatePersonalInfo(data);
      navigate("/education");
    } catch (error) {
      // console.error("Error submitting personal info:", error);
      toast.error("Failed to save personal information. Please try again.");
    }
  };

  return (
    <FormContainer
      title="Personal Information"
      description="Please provide your contact information."
      currentStep={1}
    >
      <Card className="w-full">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address Line 1
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Address Line 2 (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Apt 4B" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        City
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        State
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        Zipcode
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
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