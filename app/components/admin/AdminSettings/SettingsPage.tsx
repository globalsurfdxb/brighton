"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import CustomButton from "../../client/common/CustomButton";

interface FormValues {
  headerScript: string;
  bodyScript: string;
}

interface FormValues2 {
  currentPassword: string;
  newPassword: string;
}

const Settings = () => {
  const { register, handleSubmit, setValue, getValues } = useForm<
    FormValues | FormValues2
  >();
  const [currentPasswordIsCorrect, setCurrentPasswordIsCorrect] =
    React.useState<boolean>(false);

  const [toEmailCatalogue, setToEmailCatalogue] = useState("");
  const [toEmailContact, setToEmailContact] = useState("");

  const onSubmit = async (data: FormValues | FormValues2) => {
    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error saving details", error);
    }
  };

  const fetchTag = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      if (response.ok) {
        const data = await response.json();
        setValue("headerScript", data.tag.headerScript);
        setValue("bodyScript", data.tag.bodyScript);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching details", error);
    }
  };

  useEffect(() => {
    fetchTag();
    fetchEmails();
  }, []);

  const checkCurrentPassword = async () => {
    try {
      const currentPassword = getValues("currentPassword");
      if (!currentPassword) {
        toast.error("Please enter current password");
        return;
      }
      const response = await fetch("/api/admin/settings/check-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentPasswordIsCorrect(true);
          setValue("currentPassword", "");
          toast.success(data.message);
        } else {
          setCurrentPasswordIsCorrect(false);
          toast.error(data.message);
        }
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error saving details", error);
    }
  };

  const submitNewPassword = async () => {
    try {
      const newPassword = getValues("newPassword");
      if (!newPassword) {
        alert("Please enter new password");
        return;
      }
      const response = await fetch("/api/admin/settings/check-password", {
        method: "PATCH",
        body: JSON.stringify({ newPassword }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentPasswordIsCorrect(false);
          setValue("newPassword", "");
          toast.success(data.message);
        } else {
          setCurrentPasswordIsCorrect(false);
          toast.error(data.message);
        }
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error saving details", error);
    }
  };

  const EmailSectionSubmit = async () => {
    try {
      const response = await fetch("/api/admin/emails", {
        method: "PATCH",
        body: JSON.stringify({ toEmailCatalogue, toEmailContact }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error saving details", error);
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await fetch("/api/admin/emails");
      if (response.ok) {
        const data = await response.json();
        setToEmailCatalogue(data.data.toEmailCatalogue);
        setToEmailContact(data.data.toEmailContact);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching details", error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      <AdminItemContainer expansion={false}>
        <div className="border-b border-secondary">
          <Label main>Meta Section</Label>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <Label className="">Header Script</Label>
              <Textarea {...register("headerScript")}></Textarea>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="">Body Script</Label>
              <Textarea {...register("bodyScript")}></Textarea>
            </div>
            <CustomButton
              btnClass="w-fit"
              variant="3"
              onClick={submitNewPassword}
              text="Submit"
            />
          </form>
        </div>
      </AdminItemContainer>

      <AdminItemContainer expansion={false}>
        <div className="border-b border-secondary">
          <Label main>Change Password</Label>
        </div>
        {!currentPasswordIsCorrect ? (
          <form className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <Label className="">Current Password</Label>
              <Input {...register("currentPassword")}></Input>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[16px]">
                Type in the current password and hit continue
              </p>
              <CustomButton
                btnClass="w-fit"
                variant="3"
                onClick={checkCurrentPassword}
                text="Continue"
              />
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <Label className="">New Password</Label>
              <Input {...register("newPassword")}></Input>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[16px]">
                Type in the new password and hit continue
              </p>
              <CustomButton
                onClick={submitNewPassword}
                btnClass="w-fit"
                variant="3"
                text="Confirm"
              />
            </div>
          </form>
        )}
      </AdminItemContainer>

      <AdminItemContainer expansion={false}>
        <div className="border-b border-secondary">
          <Label main>Email Section</Label>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="">To email (Contact)</Label>
              <Input
                value={toEmailContact}
                onChange={(e) => setToEmailContact(e.target.value)}
              ></Input>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="">To email (Catalogue)</Label>
              <Input
                value={toEmailCatalogue}
                onChange={(e) => setToEmailCatalogue(e.target.value)}
              ></Input>
            </div>
            <CustomButton
              btnClass="w-fit"
              variant="3"
              onClick={EmailSectionSubmit}
              text="Submit"
            />
          </div>
        </div>
      </AdminItemContainer>
    </div>
  );
};

export default Settings;
