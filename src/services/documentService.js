import api from './api'

export const documentService = {
  async list() {
    const { data } = await api.get('/documents')
    return data
  },

  async get(id) {
    const { data } = await api.get(`/documents/${id}`)
    return data
  },

  async create(title = 'Untitled') {
    const { data } = await api.post('/documents', { title })
    return data
  },

  async update(id, { title, contentJson }) {
    const payload = {}
    if (title !== undefined) payload.title = title
    if (contentJson !== undefined) payload.content_json = contentJson

    const { data } = await api.put(`/documents/${id}`, payload)
    return data
  },
}
