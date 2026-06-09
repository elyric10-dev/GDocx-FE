import api from './api'

export const documentService = {
  async list() {
    const { data } = await api.get('/documents')
    return data
  },

  async listShared() {
    const { data } = await api.get('/documents/shared')
    return data
  },

  async listShareUsers() {
    const { data } = await api.get('/documents/share-users')
    return data
  },

  async get(id) {
    const { data } = await api.get(`/documents/${id}`)
    return data
  },

  async create(title = 'Untitled', contentJson) {
    const payload = { title }
    if (contentJson !== undefined) {
      payload.content_json = contentJson
    }
    const { data } = await api.post('/documents', payload)
    return data
  },

  async update(id, { title, contentJson }) {
    const payload = {}
    if (title !== undefined) payload.title = title
    if (contentJson !== undefined) payload.content_json = contentJson

    const { data } = await api.put(`/documents/${id}`, payload)
    return data
  },

  async share(documentId, userId) {
    const { data } = await api.post(`/documents/${documentId}/share`, {
      user_id: userId,
    })
    return data
  },

  async listDocumentShares(documentId) {
    const { data } = await api.get(`/documents/${documentId}/shares`)
    return data
  },

  async unshare(documentId, userId) {
    const { data } = await api.delete(`/documents/${documentId}/share/${userId}`)
    return data
  },
}
