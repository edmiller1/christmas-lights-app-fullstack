"use client";

import { LottieAnimation } from "@/components/lottie-animation";
import { useUser } from "@/hooks/useUser";
import christmasLoader from "../../../lottie/christmas-loader.json";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings, updateInfo } from "@/api/auth";
import { toast } from "sonner";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";

const AccountSettingsPage = () => {
  const { user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");

  // Reset form fields when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const { mutate: updateUserInfo, isPending: updateUserInfoLoading } =
    useMutation({
      mutationFn: updateInfo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-user"] });
        toast.success("Info updated successfully");
        setIsEditing(false);
      },
      onError: (error: { response?: { data?: { error?: string } } }) => {
        const errorMessage =
          error?.response?.data?.error || "Failed to update info";
        toast.error(errorMessage);
      },
    });

  const { mutate: updateUserSettings, isPending: updateUserSettingsLoading } =
    useMutation({
      mutationFn: updateSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get-user"] });
        toast.success("Settings updated successfully");
      },
      onError: (error: { response?: { data?: { error?: string } } }) => {
        const errorMessage =
          error?.response?.data?.error || "Failed to update settings";
        toast.error(errorMessage);
      },
    });

  const handleToggleNotification = (key: string) => {
    if (!user) return;

    const settings = {
      [key]: !user[key as keyof User],
    };

    updateUserSettings(settings);
  };

  const handleUpdateUserInfo = () => {
    // Form validation
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    updateUserInfo({ name, email });
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
    setIsEditing(false);
  };

  if (!user || userLoading) {
    <div className="min-h-screen md:min-h-[90vh] flex justify-center items-center">
      <LottieAnimation animationData={christmasLoader} autoplay loop />
    </div>;
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and notification settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing || updateUserInfoLoading}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        isEditing ? "bg-white" : "bg-muted"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing || updateUserInfoLoading}
                      className={`w-full p-2 mt-1 border rounded-md ${
                        isEditing ? "bg-white" : "bg-muted"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {!isEditing ? (
                    <p className="text-sm text-muted-foreground italic">
                      Click the edit button to change your name and email
                      address
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Update your name and email address
                    </p>
                  )}
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit information
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateUserInfoLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateUserInfo}
                  disabled={updateUserInfoLoading}
                >
                  {updateUserInfoLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which email notifications you&apos;d like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Rating Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get email notifications when someone rates your decoration
                    </p>
                  </div>
                  <Switch
                    checked={user?.notificationsByEmailRating}
                    onCheckedChange={() =>
                      handleToggleNotification("notificationsByEmailRating")
                    }
                    disabled={updateUserSettingsLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Verification Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get email notifications about verification status changes
                    </p>
                  </div>
                  <Switch
                    checked={user?.notificationsByEmailVerification}
                    onCheckedChange={() =>
                      handleToggleNotification(
                        "notificationsByEmailVerification"
                      )
                    }
                    disabled={updateUserSettingsLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Manage your in-app notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Rating Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get in-app notifications when someone rates your decoration
                  </p>
                </div>
                <Switch
                  checked={user?.notificationsOnAppRating}
                  onCheckedChange={() =>
                    handleToggleNotification("notificationsOnAppRating")
                  }
                  disabled={updateUserSettingsLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Verification Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get in-app notifications about verification status changes
                  </p>
                </div>
                <Switch
                  checked={user?.notificationsOnAppVerification}
                  onCheckedChange={() =>
                    handleToggleNotification("notificationsOnAppVerification")
                  }
                  disabled={updateUserSettingsLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Account Status:</h3>
                <Badge
                  variant="outline"
                  className="bg-green-300 text-green-900"
                >
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="font-medium">Plan:</h3>
                <Badge variant={user?.plan === "FREE" ? "outline" : "default"}>
                  {user?.plan}
                </Badge>
              </div>
              {user?.plan === "FREE" && (
                <div>
                  <Link href="/dashboard/upgrade">
                    <Button variant="outline" size="sm">
                      Upgrade
                    </Button>
                  </Link>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all your data
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettingsPage;
