import api from "./api";

export async function uploadHousePhotos(files: File[], propertyId: string) {
  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));
  formData.append("propertyId", propertyId);

  const { data } = await api.post("/upload/house-photos", formData);

  return data;
}
