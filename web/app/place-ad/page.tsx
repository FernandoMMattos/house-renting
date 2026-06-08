"use client";

import Form from "@/components/Form";
import FormButton from "@/components/FormButton";
import PropertyFormFields, {
  EMPTY_PROPERTY_FORM,
  formValuesToPayload,
  PropertyFormValues,
} from "@/components/PropertyFormFields";
import { useAuth } from "@/context/AuthContext";
import { createProperty } from "@/lib/property";
import { uploadHousePhotos } from "@/lib/house-image";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const PlaceAd = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [values, setValues] = useState<PropertyFormValues>(EMPTY_PROPERTY_FORM);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => () => previewUrlsRef.current.forEach(URL.revokeObjectURL), []);

  const handleChange = (field: keyof PropertyFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      if (!selected.length) return;
      previewUrlsRef.current.forEach(URL.revokeObjectURL);
      const urls = selected.map((f) => URL.createObjectURL(f));
      previewUrlsRef.current = urls;
      setFiles(selected);
      setPreviews(urls);
    },
    [],
  );

  const removeFile = useCallback((index: number) => {
    URL.revokeObjectURL(previewUrlsRef.current[index]);
    previewUrlsRef.current = previewUrlsRef.current.filter((_, i) => i !== index);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
      const property = await createProperty(formValuesToPayload(values));

      if (files.length > 0) {
        await uploadHousePhotos(files, property.id);
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      title="Announce your home"
      className="rounded-2xl border p-8 shadow-sm"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <PropertyFormFields values={values} onChange={handleChange} />

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
      </section>
    </Form>
  );
};

export default PlaceAd;
