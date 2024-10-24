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
      const escapeString = (str: string) => { // There were a bunch of issues with uploading the string so i looked up how to fix it
        return str.replace(/\\/g, '\\\\') // backslashes
                  .replace(/"/g, '\\"')   // double quotes
                  .replace(/\n/g, '\\n'); // newlines
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