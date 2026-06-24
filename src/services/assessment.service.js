import { apiClient, toApiError } from '@/lib/apiClient';
import { uploadViaPresignedUrl } from '@/lib/s3Upload';
import { ASSESSMENT_DEFAULTS, UPLOAD } from '@/constants';

export const assessmentService = {
  // ---- Trainer ----
  async list(params = {}) {
    try {
      const { data } = await apiClient.get('/trainer/assessments', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch assessments');
    }
  },

  async getById(id) {
    try {
      const { data } = await apiClient.get(`/trainer/assessments/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch assessment');
    }
  },

  async results(id) {
    try {
      const { data } = await apiClient.get(`/trainer/assessments/${id}/results`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch results');
    }
  },

  async update(id, payload) {
    try {
      const { data } = await apiClient.put(`/trainer/assessments/${id}`, payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update assessment');
    }
  },

  async remove(id) {
    try {
      const { data } = await apiClient.delete(`/trainer/assessments/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete assessment');
    }
  },

  async generateQuestions({ topic, difficulty, numberOfQuestions }) {
    try {
      const { data } = await apiClient.post('/trainer/assessments/generate-questions', {
        topic,
        difficulty,
        numberOfQuestions: Number(numberOfQuestions),
      });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to generate questions');
    }
  },

  async uploadFile(file) {
    if (!(file instanceof File)) throw new Error('Invalid file');
    if (file.size > UPLOAD.ASSESSMENT_MAX_BYTES) {
      throw new Error('File size exceeds 10MB limit');
    }
    try {
      return await uploadViaPresignedUrl(file, async (meta) => {
        const { data } = await apiClient.post('/trainer/assessments/upload/presign', meta);
        return data;
      });
    } catch (error) {
      throw toApiError(error, 'Failed to upload file');
    }
  },

  async create(input) {
    let payload;
    try {
      payload = {
        course: input.course,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        duration:
          typeof input.duration === 'number'
            ? input.duration
            : ASSESSMENT_DEFAULTS.DURATION_MINUTES,
        questions: Array.isArray(input.questions) ? input.questions : [],
        passingScore: input.passingScore || ASSESSMENT_DEFAULTS.PASSING_SCORE,
      };

      if (input.examFile instanceof File) {
        const { objectKey } = await this.uploadFile(input.examFile);
        payload.attachments = [
          {
            filename: input.examFile.name,
            objectKey,
            size: input.examFile.size,
            mimeType: input.examFile.type,
          },
        ];
      }

      const { data } = await apiClient.post('/trainer/assessments', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to create assessment');
    }
  },

  // ---- Learner ----
  async learnerList(params = {}) {
    try {
      const { data } = await apiClient.get('/learner/assessments', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch assessments');
    }
  },

  async learnerDetails(id) {
    try {
      const { data } = await apiClient.get(`/learner/assessments/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch assessment');
    }
  },

  async start(id) {
    try {
      const { data } = await apiClient.post(`/learner/assessments/${id}/start`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to start assessment');
    }
  },

  async submit(id, answers) {
    try {
      const { data } = await apiClient.post(`/learner/assessments/${id}/submit`, { answers });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to submit assessment');
    }
  },

  async result(id) {
    try {
      const { data } = await apiClient.get(`/learner/assessments/${id}/result`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch result');
    }
  },

  async downloadFile(id, fileKey) {
    try {
      const { data } = await apiClient.get(
        `/learner/assessments/${id}/files/${encodeURIComponent(fileKey)}/download`,
      );
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to download file');
    }
  },
};
