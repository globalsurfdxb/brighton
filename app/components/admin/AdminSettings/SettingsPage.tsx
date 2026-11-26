"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Code2, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import AdminButton from "@/app/components/admin/common/AdminButton";
import AdminSectionCard from "@/app/components/admin/common/AdminSectionCard";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface ScriptsForm {
  headerScript: string;
  bodyScript: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const MIN_PASSWORD_LENGTH = 8;

function PasswordInput({
  id,
  visible,
  onToggle,
  invalid,
  ...props
}: React.ComponentProps<"input"> & {
  visible: boolean;
  onToggle: () => void;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("pr-11", invalid && "border-red-400 focus-visible:border-red-500")}
        aria-invalid={invalid}
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-description-color transition-colors hover:bg-cream-background hover:text-primary"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-[12.5px] text-red-600">
      {message}
    </p>
  );
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<Record<keyof PasswordForm, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const toggleVisible = (field: keyof PasswordForm) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const scripts = useForm<ScriptsForm>({
    defaultValues: { headerScript: "", bodyScript: "" },
  });
  const { isDirty, markClean, changes } = useUnsavedChanges(
    scripts.control,
    scripts.getValues,
  );

  const password = useForm<PasswordForm>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const passwordErrors = password.formState.errors;

  const fetchScripts = async () => {
    try {
      const res = await fetch("/api/admin/tags");
      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Failed to load scripts");
        return;
      }
      const { tag } = await res.json();
      scripts.reset({
        headerScript: tag?.headerScript ?? "",
        bodyScript: tag?.bodyScript ?? "",
      });
      markClean();
    } catch (e) {
      console.error(e);
      toast.error("Failed to load scripts");
    }
  };

  useEffect(() => {
    fetchScripts().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveScripts = async (data: ScriptsForm) => {
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const { message } = await res.json();
      if (!res.ok) {
        toast.error(message || "Failed to save scripts");
        return;
      }
      toast.success("Scripts saved");
      markClean();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  const changePassword = async ({ currentPassword, newPassword }: PasswordForm) => {
    try {
      const res = await fetch("/api/admin/settings/check-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const { message } = await res.json();
      if (!res.ok) {
        toast.error(message || "Failed to change password");
        return;
      }
      toast.success(message || "Password changed");
      password.reset();
      setVisible({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLoadable loading={loading}>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        <form onSubmit={scripts.handleSubmit(saveScripts)}>
          <AdminPageActions isDirty={isDirty} changes={changes}>
            <AdminSubmitButton saving={scripts.formState.isSubmitting} />
          </AdminPageActions>

          <AdminSectionCard
            title={
              <span className="inline-flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Tracking Scripts
              </span>
            }
            description="Add analytics or tracking snippets such as Google Tag Manager or Meta Pixel. Paste the full code including the script tags."
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="headerScript" className="font-bold">
                Header Script
              </Label>
              <p className="-mt-1 text-[12.5px] text-description-color">
                Placed inside the page head.
              </p>
              <Textarea
                id="headerScript"
                {...scripts.register("headerScript")}
                placeholder="<script>…</script>"
                spellCheck={false}
                className="min-h-[180px] font-mono text-[13px] leading-relaxed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bodyScript" className="font-bold">
                Body Script
              </Label>
              <p className="-mt-1 text-[12.5px] text-description-color">
                Placed at the start of the page body, for example a Tag Manager noscript fallback.
              </p>
              <Textarea
                id="bodyScript"
                {...scripts.register("bodyScript")}
                placeholder="<noscript>…</noscript>"
                spellCheck={false}
                className="min-h-[180px] font-mono text-[13px] leading-relaxed"
              />
            </div>
          </AdminSectionCard>
        </form>

        <form onSubmit={password.handleSubmit(changePassword)}>
          <AdminSectionCard
            title={
              <span className="inline-flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Change Password
              </span>
            }
            description="You will stay signed in on this device after changing your password."
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword" className="font-bold">
                Current Password
              </Label>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                visible={visible.currentPassword}
                onToggle={() => toggleVisible("currentPassword")}
                invalid={!!passwordErrors.currentPassword}
                {...password.register("currentPassword", {
                  required: "Enter your current password",
                })}
              />
              <FieldError message={passwordErrors.currentPassword?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword" className="font-bold">
                New Password
              </Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                visible={visible.newPassword}
                onToggle={() => toggleVisible("newPassword")}
                invalid={!!passwordErrors.newPassword}
                {...password.register("newPassword", {
                  required: "Enter a new password",
                  minLength: {
                    value: MIN_PASSWORD_LENGTH,
                    message: `Use at least ${MIN_PASSWORD_LENGTH} characters`,
                  },
                  validate: (value, values) =>
                    value !== values.currentPassword ||
                    "New password must be different from the current one",
                })}
              />
              <FieldError message={passwordErrors.newPassword?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="font-bold">
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                visible={visible.confirmPassword}
                onToggle={() => toggleVisible("confirmPassword")}
                invalid={!!passwordErrors.confirmPassword}
                {...password.register("confirmPassword", {
                  required: "Confirm the new password",
                  validate: (value, values) =>
                    value === values.newPassword || "Passwords do not match",
                })}
              />
              <FieldError message={passwordErrors.confirmPassword?.message} />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="inline-flex items-center gap-1.5 text-[12.5px] text-description-color">
                <ShieldCheck className="h-4 w-4" />
                At least {MIN_PASSWORD_LENGTH} characters
              </p>
              <AdminButton
                type="submit"
                icon={KeyRound}
                disabled={password.formState.isSubmitting}
              >
                {password.formState.isSubmitting ? "Updating" : "Update Password"}
              </AdminButton>
            </div>
          </AdminSectionCard>
        </form>
      </div>
    </AdminLoadable>
  );
};

export default Settings;
