import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const apiUrl = 'http://localhost:3000';

export const useCommentStore = defineStore('comment', {
      state: () => ({
        comments: [],
        authUser: {
          name: "",
          image: ""
        },
        deleteKeys: {}
      }),
      getters: {
        itemComments: (state) => state.comments,
        currentUser: (state) => state.authUser
      },
      actions: {
        setNewComment(msg) {
          const currentDate = new Date();
          const timestamp = currentDate.getTime();

          const data = {
            createdAt: timestamp,
            ...msg,
            user: this.authUser,
            dislikedBy: [],
            likedBy: []
          }

          fetch(`${apiUrl}/comments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            this.getComments();
            return response.json();
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        onEditComment({id, ...data}) {
          const currentDate = new Date();
          const timestamp = currentDate.getTime();

          data.updatedAt = timestamp;
          console.log('------------>');

          fetch(`${apiUrl}/comments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            this.getComments();
            return response.json();
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        getComments() {
          fetch(`${apiUrl}/comments`).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data => {
            this.comments = data;
            console.log('Post created:', data);
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        getAuthUser() {
          fetch(`${apiUrl}/users/1`).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data => {
            this.authUser = data;
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        softDelete(id) {
          const currentDate = new Date();
          const timestamp = currentDate.getTime();

          const self = this;
          const data = this.comments.find(v => v.id === id);
          data.softDelete = true;
          data.deletedAt = timestamp;
          this.deleteKeys[id] = setTimeout(() => {
            self.deleteComment(id);
          }, 10000);
          fetch(`${apiUrl}/comments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            this.getComments();
            return response.json();
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        cancelDelete(id) {
          const data = this.comments.find(v => v.id === id);
          delete data.softDelete;
          delete data.deletedAt;
          if (this.deleteKeys[id]) {
            clearTimeout(this.deleteKeys[id]);
          }

          fetch(`${apiUrl}/comments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            this.getComments();
            return response.json();
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        deleteComment(id) {
          fetch(`${apiUrl}/comments/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            this.getComments();
            return response.json();
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
        likeDislikeEvent({id, target}) {
          const data = this.comments.find(v => v.id === id);
          const reTarget = target === 'likedBy' ? 'dislikedBy' : 'likedBy';
          if (data[target].includes(this.authUser.id)) {
            data[target] = data[reTarget].filter(v => v !== this.authUser.id);
          } else {
            data[target].push(this.authUser.id);
            data[reTarget] = data[reTarget].filter(v => v !== this.authUser.id);
          }


          fetch(`${apiUrl}/comments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            this.getComments();
            return response.json();
          }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        },
      }
    })
