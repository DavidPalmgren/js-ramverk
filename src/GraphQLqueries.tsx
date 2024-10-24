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

    updateDocument: (document: string, title: string, content: string): string => {
      const escapeString = (str: string) => {
        return str.replace(/\\/g, '\\\\') // Escape backslashes
                  .replace(/"/g, '\\"')   // Escape double quotes
                  .replace(/\n/g, '\\n'); // Escape newlines
      };
    
      return `mutation {
        updateDocument(document: "${escapeString(document)}", title: "${escapeString(title)}", content: "${escapeString(content)}") {
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