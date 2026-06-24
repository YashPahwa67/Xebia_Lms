// 3-step presigned upload: ask backend for a URL, PUT the file, register the key
//   1) request a presigned PUT URL from the API
//   2) PUT the raw file directly to S3
//   3) the caller registers the returned objectKey with the API
//
// `presign` is a function that returns { url | uploadUrl, objectKey }.
export async function uploadViaPresignedUrl(file, presign) {
  if (!file) throw new Error('No file provided');

  const presignResult = await presign({
    filename: file.name,
    contentType: file.type,
    fileSize: Number(file.size),
  });

  const url = presignResult.uploadUrl || presignResult.url;
  const objectKey = presignResult.objectKey;
  if (!url || !objectKey) throw new Error('Invalid presigned URL response');

  const res = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
  });
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`);

  return { objectKey, filename: file.name };
}
