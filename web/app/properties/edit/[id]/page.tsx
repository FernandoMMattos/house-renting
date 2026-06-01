"use client";

import Form from "@/components/Form";
import FormButton from "@/components/FormButton";
import PropertyFormFields, {
  PropertyFormValues,
} from "@/components/PropertyFormFields";
import { getProperty } from "@/lib/property";
import { updateProperty } from "@/lib/property";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EMPTY: PropertyFormValues = {
  street: "",
  number: "",
  areaCode: "",
  eirCode: "",
  propertyType: "house",
  roomType: "single",
  bedrooms: "",
  bathrooms: "",
  people: "",
  price: "",
  availableFrom: "",
  availableFor: "",
  description: "",
};

const EditPropertyPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [values, setValues] = useState<PropertyFormValues>(EMPTY);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          people: String(property.sharingWith),
          price: String(property.price),
          availableFrom: property.availableFrom,
          availableFor: property.availableFor,
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
        street: values.street,
        number: Number(values.number),
        areaCode: Number(values.areaCode),
        eirCode: values.eirCode,
        propertyType: values.propertyType,
        roomType: values.roomType,
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        sharingWith: Number(values.people),
        price: Number(values.price),
        availableFrom: values.availableFrom,
        availableFor: values.availableFor,
        description: values.description,
        isActive,
      });
      router.push("/profile");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="mx-20 my-10 text-gray-400">Loading...</p>;

  return (
    <Form
      onSubmit={handleSubmit}
      title="Edit your listing"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border p-8 shadow-sm"
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute cursor-pointer mt-3 text-sm text-gray-500 hover:text-gray-800"
      >
        ← Back
      </button>

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
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
              isActive ? "translate-x-0" : "-translate-x-5"
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
    </Form>
  );
};

export default EditPropertyPage;
