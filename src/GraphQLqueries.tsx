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

    updateDocument: (document: string, content: string) : string => {
        return `mutation {
          updateDocument(content: "${content}", document: "${document}") {
            id
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