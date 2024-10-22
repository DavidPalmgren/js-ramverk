export default {
    getUser: () : string => {
        return `query {
          user {
            id
            documents {
              id
              title
            }
          }
        }`
    },
    getDocument: (document: string) : string => {
        return `query {
          document(id: "${document}") {
            id
            title
            content
          }
        }`;
    },
    createDocument: (title: string) => {
        return `mutation {
          createDocument(title: "${title}") {
            id
            title
          }
        }`;
    },

    updateDocument: (document: string, title: string, content: string) : string => {
      return `mutation {
        updateDocument(document: "${document}", title: "${title}", content: "${content}") {
          id
          title
          content
        }
      }`;
  },
    addUsers: (users: string[], documentId: string ) : string => {
        return `mutation {
            inviteUsers(users: "${users}", documentId: "${documentId}")
        }`;
    }
}