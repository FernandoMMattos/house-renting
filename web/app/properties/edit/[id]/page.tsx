"use client";

import Form from "@/components/Form";
import FormButton from "@/components/FormButton";
import PropertyFormFields, {
  EMPTY_PROPERTY_FORM,
  formValuesToPayload,
  PropertyFormValues,
} from "@/components/PropertyFormFields";
import { deleteProperty, getProperty, updateProperty } from "@/lib/property";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditPropertyPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [values, setValues] = useState<PropertyFormValues>(EMPTY_PROPERTY_FORM);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProperty(id as string)
      .then((property) => {
        setValues({
          street: property.street,
          number: String(property.number),
          areaCode: String(property.areaCode),
          eirCode: property.eirCode,
          propertyType: property.propertyType,
          roomType: property.roomType,
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          sharingWith: String(property.sharingWith),
          price: String(property.price),
          availableFrom: property.availableFrom,
          availableUntil: property.availableUntil,
          description: property.description,
        });
        setIsActive(property.isActive);
      })
      .catch(() => setError("Failed to load property."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof PropertyFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await updateProperty(id as string, {
        ...formValuesToPayload(values),
        isActive,
      });
      router.push("/profile");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    try {
      setDeleting(true);
      await deleteProperty(id as string);
      router.push("/profile");
    } catch {
      setError("Failed to delete property. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="mx-20 my-10 text-gray-400">Loading...</p>;

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        title="Edit your listing"
        className="rounded-2xl border p-8 shadow-sm"
      >
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PropertyFormFields values={values} onChange={handleChange} />

          <div className="md:col-span-2 flex items-center justify-between rounded-2xl border-2 border-gray-800 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">Listing active</span>
              <span className="text-sm text-gray-500">
                {isActive
                  ? "Your listing is visible to everyone."
                  : "Your listing is hidden from search."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full transition-colors duration-300 cursor-pointer ${
                isActive ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}

          <div className="md:col-span-2 flex justify-center pt-4">
            <FormButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </FormButton>
          </div>

          <div className="md:col-span-2 flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete property
            </button>
          </div>
        </section>
      </Form>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900">Delete property?</h2>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {deleting ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPropertyPage;
