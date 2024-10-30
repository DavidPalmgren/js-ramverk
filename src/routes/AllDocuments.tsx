import { useEffect, useState } from 'react';
import graphQLqueries from '../GraphQLqueries.tsx';
// Unused.. i didnt make it so ill just leave it
export default () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    (async () => {
      const apiAddress = import.meta.env.VITE_API_ADDRESS;
      const token = localStorage.getItem('Bearer');
      const query = graphQLqueries.getUser();
      console.log(token);
      try {
        const response = await fetch(`${apiAddress}/query`, {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
          }),
        });

        const documents = (await response.json()).data.user.documents;
        setDocuments(documents);
        console.log(documents);
      } catch (errorMsg) {
        console.error(errorMsg);
      }
    })();
  }, []);

  return (
    <div>
      <h1>Documents List</h1>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <a href={`/documents/${doc.id}`}>{doc.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
