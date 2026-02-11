<template>
  <div class="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
    <h1 class="text-3xl font-bold text-blue-900 mb-8">Admin Dashboard & Comments</h1>

    <div class="w-full max-w-2xl flex justify-end mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div v-if="!token" class="flex gap-2 items-center">
        <span class="text-sm font-bold text-gray-500">Admin Area:</span>
        <input v-model="username" placeholder="Username" class="border p-2 rounded text-sm text-black">
        <input v-model="password" type="password" placeholder="Password" class="border p-2 rounded text-sm text-black">
        <button @click="handleLogin" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Login</button>
      </div>
      <div v-else class="flex items-center gap-4">
        <span class="text-green-600 font-bold flex items-center gap-2">
          ✓ Logged in as Admin
        </span>
        <button @click="logout" class="text-red-500 text-sm font-bold hover:underline">Logout</button>
      </div>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-lg font-bold mb-2 text-gray-700">Leave a comment</h2>
      <textarea 
        v-model="newComment" 
        class="w-full border p-3 rounded-lg mb-4 text-black focus:ring-2 focus:ring-blue-500 outline-none" 
        rows="3"
        placeholder="Type something here..."
      ></textarea>
      <div class="flex justify-end">
        <Button @click="postComment">Post Public Comment</Button>
      </div>
    </div>

    <div class="w-full max-w-2xl space-y-4">
      <div v-if="loading" class="text-center text-gray-500">Loading comments...</div>
      
      <div v-else v-for="comment in comments" :key="comment._id" class="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500 relative group">
        
        <div v-if="editingId !== comment._id">
          <p class="text-gray-800 text-lg">{{ comment.text }}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs text-gray-400 font-mono">{{ formatDate(comment.createdAt) }}</span>
            
            <div v-if="token" class="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="startEdit(comment)" class="text-blue-600 font-bold text-sm">Edit</button>
              <button @click="deleteComment(comment._id)" class="text-red-600 font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>

        <div v-else>
          <input v-model="editText" class="w-full border p-2 rounded mb-2 text-black">
          <div class="flex justify-end gap-2">
            <button @click="editingId = ''" class="text-gray-500 text-sm">Cancel</button>
            <button @click="saveEdit(comment._id)" class="bg-green-600 text-white px-3 py-1 rounded text-sm">Save</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const comments = ref<any[]>([])
const newComment = ref('')
const loading = ref(false)

const token = useCookie('auth_jwt') 
const username = ref('')
const password = ref('')
const editingId = ref('')
const editText = ref('')

const fetchComments = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/comments')
    comments.value = data as any[]
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  try {
    const res = await $fetch('/api/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    token.value = res.token
    username.value = ''
    password.value = ''
  } catch (e) {
    alert('Login failed. Try admin / admin123')
  }
}

const logout = () => {
  token.value = null
}

const postComment = async () => {
  if (!newComment.value.trim()) return
  await $fetch('/api/comments', {
    method: 'POST',
    body: { text: newComment.value }
  })
  newComment.value = ''
  fetchComments()
}

const deleteComment = async (id: string) => {
  if (!confirm('Delete this comment?')) return
  try {
    await $fetch(`/api/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    fetchComments()
  } catch (e) {
    alert('Unauthorized or Error')
  }
}

const startEdit = (comment: any) => {
  editingId.value = comment._id
  editText.value = comment.text
}

const saveEdit = async (id: string) => {
  try {
    await $fetch(`/api/comments/${id}`, {
      method: 'PUT',
      body: { text: editText.value },
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    editingId.value = ''
    fetchComments()
  } catch (e) {
    alert('Unauthorized or Error')
  }
}

const formatDate = (date: string) => new Date(date).toLocaleString()

onMounted(fetchComments)
</script>