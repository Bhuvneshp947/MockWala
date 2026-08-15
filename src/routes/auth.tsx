import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Student sign in — PrepSmart" },
      {
        name: "description",
        content:
          "Sign in or create your PrepSmart student account to take timed mock tests and track your exam performance.",
      },
      { property: "og:title", content: "Student sign in — PrepSmart" },
      {
        property: "og:description",
        content: "Create a student account to start timed mock tests for UPSC, SSC, IBPS and RRB.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a 10 digit mobile number"),
  class_level: z.string().min(1, "Select your class"),
  target_exam: z.string().min(1, "Select your target exam"),
  school: z.string().trim().min(2, "Enter your school name").max(120),
  city: z.string().trim().min(2, "Enter your city").max(60),
});

const classes = ["Class 5", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper"];
const targets = [
  "JEE Main 2027",
  "JEE Advanced 2027",
  "NEET UG 2027",
  "JNVST Class 6",
  "JNVST Class 9",
];

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [session, loading, navigate]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = Object.fromEntries(form.entries()) as Record<string, string>;
    const parsed = signUpSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setBusy(true);
    const { full_name, email, password, phone, class_level, target_exam, school, city } =
      parsed.data;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone, class_level, target_exam, school, city },
      },
    });

    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!data.session && data.user) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError || !signInData.session) {
        toast.error("Account created, but automatic sign-in is not available yet.");
        return;
      }
      toast.success(`Welcome, ${full_name.split(" ")[0]}!`);
      navigate({ to: "/dashboard" });
      return;
    }

    if (!data.session) {
      toast.success(`Welcome, ${full_name.split(" ")[0]}!`);
    } else {
      toast.success(`Welcome, ${full_name.split(" ")[0]}!`);
    }

    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-hero-gradient p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-20 top-20 size-72 rounded-full bg-accent/25 blur-3xl animate-float" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">PrepSmart</span>
        </Link>
        <div className="relative">
          <h2 className="animate-rise max-w-sm text-4xl font-bold leading-tight">
            Your exam. Your subjects. Your real score.
          </h2>
          <p className="animate-rise mt-4 max-w-sm text-primary-foreground/80">
            Timed mock tests for UPSC, SSC, IBPS, RRB and other competitive exams, with a full
            performance report after every attempt.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/60">
          Your details stay private and are used only for your report card.
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">PrepSmart</span>
          </Link>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="animate-pop mt-6">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to continue your mock test practice.
              </p>
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required placeholder="you@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-password">Password</Label>
                  <Input id="si-password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="animate-pop mt-6">
              <h1 className="text-2xl font-bold">Create your student account</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                These details appear on every report you generate.
              </p>
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <Field label="Full name" name="full_name" error={errors["full_name"]}>
                  <Input id="full_name" name="full_name" placeholder="Aarav Sharma" required />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email" name="email" error={errors["email"]}>
                    <Input id="email" name="email" type="email" placeholder="you@email.com" required />
                  </Field>
                  <Field label="Mobile number" name="phone" error={errors["phone"]}>
                    <Input id="phone" name="phone" inputMode="numeric" placeholder="9876543210" required />
                  </Field>
                </div>
                <Field label="Password" name="password" error={errors["password"]}>
                  <Input id="password" name="password" type="password" required />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Class" name="class_level" error={errors["class_level"]}>
                    <Select name="class_level" defaultValue="Class 11">
                      <SelectTrigger id="class_level">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Target exam" name="target_exam" error={errors["target_exam"]}>
                    <Select name="target_exam" defaultValue="JEE Main 2027">
                      <SelectTrigger id="target_exam">
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {targets.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="School / Institute" name="school" error={errors["school"]}>
                    <Input id="school" name="school" placeholder="Kendriya Vidyalaya" required />
                  </Field>
                  <Field label="City" name="city" error={errors["city"]}>
                    <Input id="city" name="city" placeholder="Jaipur" required />
                  </Field>
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
