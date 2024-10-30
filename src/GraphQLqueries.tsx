export default {
    getUser: () : string => {
        return `query {
          user {
            id
            documents {
              id
              title
              content
              code
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
            code
            comments { id comment line }
          }
        }`;
    },
    createDocument: (title: string, code: boolean) => {
        return `mutation {
          createDocument(title: "${title}", code: ${code}) {
            id
            title
            code
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
    insertComment: (document: string, comment:string, line: string) => {
      return `mutation {
        insertComment(documentId: "${document}", comment: "${comment}", line: "${line}") {
          id
          comment
          line
        }
      }`;
    },
  addUsers: (users: string[], documentId: string): string => {
    return `mutation {
        inviteUsers(users: [${users.map(user => `"${user}"`).join(', ')}], documentId: "${documentId}")
    }`;
}
}