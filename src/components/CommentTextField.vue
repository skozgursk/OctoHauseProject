<template>
  <div class="comment-text-field max-w-md mx-auto bg-white rounded-xl shadow-md p-4 my-4">

    <div class="textarea-container">
      <textarea
          class="w-full h-32 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300"
          v-model="message"
          placeholder="Type your message..."
      ></textarea>

      <!-- This div will be positioned at the bottom right of the textarea -->
      <div v-if="attachment" class="bottom-right-div">
        Attached File: <img :src="attachment">

      </div>
    </div>

    <div
        ref="emojiContainer"
        class="emoji-container fixed"
        v-show="!isEmojiModalHidden">
      <EmojiPicker :native="true" @select="onSelectEmoji" />
    </div>

    <div class="flex justify-between items-center mt-2">
      <div class="flex space-x-2">
        <button class="w-4" @click="attachFile">
          <vue-feather class="text-slate-300 w-4" type="paperclip"></vue-feather>
        </button>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
        <button class="w-4" @click="openEmojiPicker">
          <vue-feather class="text-slate-300 w-4" type="smile"></vue-feather>
        </button>
      </div>
      <button class="uppercase tracking-wider px-6 py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700" @click="submitMessage">Submit</button>
    </div>
  </div>
</template>

<script>
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css'

export default {
  name: "CommentTextField",
  props: {
    comment: Object
  },
  components: {
    EmojiPicker
  },
  mounted() {
    if (this.comment) {
      this.setData();
    }
  },
  data() {
    return {
      isEmojiModalHidden: true,
      message: '',
      attachment: null
    }
  },
  methods: {
    setData() {
      this.message = this.comment.text;
      this.attachment = this.comment.attachment;
    },
    onSelectEmoji(emoji) {
      this.message = this.message + emoji.i;
    },
    attachFile() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.attachment = e.target.result // Set the Base64-encoded image to the textarea
        };

        reader.readAsDataURL(selectedFile);
      }
      // Do something with the selected file (e.g., upload it or display its information)
      console.log("Selected file:", selectedFile);
    },
    openEmojiPicker(e) {
      this.$refs.emojiContainer.style.top = `${(e.clientY - e.offsetY) + 70}px`
      this.$refs.emojiContainer.style.left = `${(e.clientX - e.offsetX) - 50}px`
      this.isEmojiModalHidden = !this.isEmojiModalHidden
    },
    submitMessage() {
      if (this.comment) {
        const data = this.comment;
        data.text = this.message;
        data.attachment = this.attachment;

        this.$emit('onMessageSubmit', data);
      } else {
        this.$emit('onMessageSubmit', {
          text: this.message,
          attachment: this.attachment
        });
      }

      this.message = "";
      this.attachment = null;
    },
  },
}
</script>

<style>
.comment-text-field {
  max-width: 100%;
  width: 360px;
}

.emoji-container {
  width: 365px;
  max-width: 100%;
}
.emoji-container > .v3-emoji-picker {
  width: 100%;
}

.textarea-container {
  position: relative;
  width: 330px; /* Adjust the width as needed */
  max-width: 100%;
}


.bottom-right-div {
  position: absolute;
  bottom: 8px;
  object-fit: cover;
  left: 13px;
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
  height: 20px;
  width: 100%;
  display: flex;
  font-size: 11px;
  line-height: 20px;
}

.bottom-right-div > img {
  object-fit: scale-down;
  height: 100%;
  width: 20px;
  margin-left: 5px;
  border-radius: 3px;
}

</style>
