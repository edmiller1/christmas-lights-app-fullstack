"use client";

import { useUser } from "@/hooks/useUser";

const AccountSettingsPage = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Account Settings</h1>
    </div>
  );
};

export default AccountSettingsPage;
