// Centralized, typed access to Vite environment variables.
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 60000,
  awsRegion: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  s3Bucket: import.meta.env.VITE_S3_BUCKET || '',
};
