"use client";

import Input from "@/components/Input";
import FormButton from "@/components/FormButton";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/lib/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import { getMyProperties } from "@/lib/property";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getMyProperties()
      .then(setProperties)
      .catch(() => setError("Failed to load your properties."))
      .finally(() => setLoadingProperties(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setSaving(true);
      await updateUser({
        ...(name !== user?.name && { name }),
        ...(password && { password, currentPassword }),
      });
      setSuccess("Profile updated successfully.");
      setPassword("");
      setCurrentPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen justify-center py-10 px-4">
      <div className="w-full max-w-5xl flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer text-sm text-gray-500 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 max-w-md"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-500">
                Email (cannot be changed)
              </label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-100 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="currentPassword">Current Password</label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required to change password"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password">New Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <FormButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </FormButton>
          </form>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Listings</h2>
            <button
              type="button"
              onClick={() => router.push("/place-ad")}
              className="text-sm text-blue-600 underline hover:cursor-pointer"
            >
              + Add new
            </button>
          </div>

          {loadingProperties ? (
            <p className="text-gray-400">Loading your properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-gray-500">
              You haven't listed any properties yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="flex flex-col gap-2">
                  <PropertyCard property={property} />
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/properties/edit/${property.id}`)
                    }
                    className="w-full rounded-lg border-2 border-gray-800 py-1.5 text-sm font-semibold hover:bg-gray-800 hover:text-white transition duration-300 hover:cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={() => logout()}
          className="self-start text-sm text-red-500 underline hover:cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
