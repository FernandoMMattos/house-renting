export async function uploadHousePhotos (files: File[], houseId: string) {
  const formData = new FormData()
  files.forEach(file => formData.append('photos', file))
  formData.append('houseId', houseId)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/house-photos`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error("Upload Failed")
    return res.json()
}