<template>
  <div class="min-h-screen w-full flex justify-center items-center">

    <div class="container mx-auto sm:w-420">
      <comment-text-field @onMessageSubmit="setNewComment"></comment-text-field>



      <template v-for="comment in itemComments">
        <comment-item
            @onDelete="deleteComment"
            @onSoftDelete="softDelete"
            @cancelDelete="cancelDelete"
            @commentAction="likeDislikeEvent"
            @openEdit="(id) => {editCommentId = id}"
            v-if="editCommentId !== comment.id"
            :comment="comment"
            :user="currentUser"
            :key="`${comment.id}-comment`"
        ></comment-item>
        <comment-text-field
            v-else
            :comment="comment"
            @onCancel="() => {editCommentId = null;}"
            @onMessageSubmit="(e) => {editCommentId = null; console.log('--f', e); onEditComment(e)}"></comment-text-field>
      </template>
    </div>
  </div>
</template>

<script>
import CommentTextField from "../components/CommentTextField.vue";
import CommentItem from "../components/CommentItem.vue";
import {useCommentStore} from "../stores/comments";
import {mapActions, mapState} from "pinia/dist/pinia";

export default {
  name: "CommentView",
  data() {
    return {
      editCommentId: null
    }
  },
  components: {
    CommentItem,
    CommentTextField},
  mounted() {
    this.getComments();
  },
  computed: {
    ...mapState(useCommentStore, ['itemComments']),
    ...mapState(useCommentStore, ['currentUser'])
  },
  methods: {
    ...mapActions(useCommentStore, ['getComments']),
    ...mapActions(useCommentStore, ['setNewComment']),
    ...mapActions(useCommentStore, ['onEditComment']),
    ...mapActions(useCommentStore, ['deleteComment']),
    ...mapActions(useCommentStore, ['softDelete']),
    ...mapActions(useCommentStore, ['cancelDelete']),
    ...mapActions(useCommentStore, ['likeDislikeEvent']),

  }
}
</script>

<style scoped>

</style>
