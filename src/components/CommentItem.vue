<template>
  <div class="comment-item max-w-md mx-auto bg-white rounded-lg shadow-md my-4 divide-y divide-blue-200">
    <div class="p-5 flex">
      <div class="pr-1">
        <img class="w-10 h-10 rounded-full" :src="comment.user.image" alt="User Avatar">
      </div>
      <div class="pl-1">
        <div class="text-slate-300 text-[8px]">
          {{formattedDate(comment.createdAt)}}
          <template v-if="comment.updatedAt">
            /
            {{formattedDate(comment.updatedAt)}}
          </template>
        </div>
        <div class="text-[16px] text-gray-500 tracking-tighter font-medium">
          <span class="text-purple-500">{{ comment.user.name }}</span>
          {{comment.text}}
          <div class="w-full flex justify-center items-center image-container my-4" v-if="comment.attachment">
            <img class="w-44 rounded-lg" :src="comment.attachment">
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between px-5 py-3">

      <div class="flex items-center h-4">
        <button class="w-4 h-4"
                @click="likeComment">

          <vue-feather
              class="w-4 h-4"
              :class="comment.likedBy.includes(user.id) ? 'text-purple-500' : 'text-slate-300'"
              type="thumbs-up"></vue-feather>
        </button>
        <span class="text-slate-300 ml-1 w-4 h-4 leading-4">{{ comment.likedBy.length }}</span>
        <button class="w-4 h-4" @click="dislikeComment">
          <vue-feather
              class="w-4 h-4"
              :class="comment.dislikedBy.includes(user.id) ? 'text-purple-500' : 'text-slate-300'"
              type="thumbs-down"></vue-feather>
        </button>
        <span class="text-slate-300 ml-1 w-4 h-4 leading-4">{{ comment.dislikedBy.length }}</span>
      </div>

      <div class="flex h-4 space-x-2">
        <button class="w-4 h-4" @click="editComment">
          <vue-feather class="text-slate-300 w-4 h-4" type="edit-3"></vue-feather>
        </button>
        <button v-if="comment.softDelete && !isTenSecondsAfter()" class="w-4 h-4" @click="cancelDelete">
          <vue-feather class="text-slate-300 w-4 h-4" type="rotate-ccw"></vue-feather>
        </button>
        <button v-else class="w-4 h-4" @click="softDelete">
          <vue-feather class="text-slate-300 w-4 h-4" type="trash-2"></vue-feather>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItem",
  props: {
    comment: Object,
    user: Object
  },
  methods: {
    formattedDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString(); // Format according to user's locale
    },
    isTenSecondsAfter(time) {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();

      return (time + 10000) < timestamp;
    },
    likeComment() {
      this.$emit('commentAction', {
        id: this.comment.id,
        target: 'likedBy'
      })

    },
    dislikeComment() {
      this.$emit('commentAction', {
        id: this.comment.id,
        target: 'dislikedBy'
      })
    },
    editComment() {
      this.$emit('openEdit', this.comment.id)
    },
    cancelDelete() {
      this.$emit('cancelDelete', this.comment.id)
    },
    deleteComment() {
      this.$emit('onDelete', this.comment.id)
    },
    softDelete() {
      this.$emit('onSoftDelete', this.comment.id);
    },
  },
}
</script>

<style scoped>
.comment-item {
  max-width: 100%;
  width: 360px;
}

.image-container {
  max-width: 100%;
  min-width: 270px;
}
</style>
