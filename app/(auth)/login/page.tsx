"use client";
import { login } from "@/action/login/login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schema/auth";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";

export default function Login() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("email", values.value.email);
      formData.append("password", values.value.password);
      login(formData);
    },
  });
  return (
    <div className="flex mt-16 items-center justify-center ">
      <Card className="w-full min-h-96 max-w-md justify-between">
        <CardHeader>
          <h2 className="text-2xl font-bold">Login</h2>
        </CardHeader>
        <CardContent className="flex-1">
          <form onSubmit={form.handleSubmit}>
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      placeholder="Enter your email"
                    />
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      type="password"
                      onChange={(e) => field.setValue(e.target.value)}
                      placeholder="Enter your email"
                    />
                    {field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" onClick={form.handleSubmit} className="w-1/2">
              Login
            </Button>
            <Button asChild variant="outline" className="w-1/2">
              <Link href="/register">Register</Link>
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
