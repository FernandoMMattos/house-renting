"use client";

import Form from "@/components/Form";
import FormButton from "@/components/FormButton";
import PropertyFormFields, {
  PropertyFormValues,
} from "@/components/PropertyFormFields";
import { useAuth } from "@/context/AuthContext";
import { createProperty } from "@/lib/property";
import { uploadHousePhotos } from "@/lib/house-image";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

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

const PlaceAd = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState<PropertyFormValues>(EMPTY);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof PropertyFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      if (!selected.length) return;
      setFiles(selected);
      setPreviews(selected.map((f) => URL.createObjectURL(f)));
    },
    [],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setUploading(true);

      const property = await createProperty({
        street: values.street,
        number: Number(values.number),
        areaCode: Number(values.areaCode),
        description: values.description,
        eirCode: values.eirCode,
        propertyType: values.propertyType,
        roomType: values.roomType,
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        sharingWith: Number(values.people),
        availableFrom: values.availableFrom,
        availableFor: values.availableFor,
        price: Number(values.price),
      });

      if (files.length > 0) {
        await uploadHousePhotos(files, property.id);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      title="Announce your home"
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

      {/* Photo upload */}
      <div className="md:col-span-2 flex flex-col gap-3">
        <label htmlFor="images" className="font-medium">
          Photos of the house
        </label>
        <div
          className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-500"
          onClick={() => document.getElementById("images")?.click()}
        >
          <span className="text-sm text-gray-500">
            Click to select photos (JPG, PNG, WebP — max 10MB each)
          </span>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((src, i) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Preview ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute right-1 top-1 hidden rounded-full bg-black/60 px-2 py-0.5 text-xs text-white group-hover:block"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}

      <div className="md:col-span-2 flex flex-col items-center gap-2 pt-4">
        <FormButton type="submit" disabled={uploading}>
          {uploading ? "Publishing..." : "Announce"}
        </FormButton>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Change your mind? Click here to cancel
        </Link>
      </div>
    </Form>
  );
};

export default PlaceAd;
