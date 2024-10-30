import './assets/App.css';
import { useEffect, useState } from 'react';
import graphQLqueries from './GraphQLqueries.tsx';
import { Link } from 'react-router-dom';

function App() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS;

  const [documents, setDocuments] = useState([]);

  const [createToggle, setCreateToggle] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState(false);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('Bearer');
      const query = graphQLqueries.getUser();
      const response = await fetch(`${apiAddress}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data.user.documents);
        console.log(data);
      } else {
        const errorText = await response.text();
        console.error(`Error: ${response.status} ,  ${errorText}`);
      }
    } catch (errorMsg) {
      console.error(errorMsg);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function postDocument() {
    //content removed now just blank default
    try {
      const token = localStorage.getItem('Bearer');
      console.log('type of code: ', typeof code);
      const query = graphQLqueries.createDocument(title, code);
      console.log('QUery: ', query);
      const response = await fetch(`${apiAddress}/query`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ query }),
        method: 'POST',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error: ${response.status}: ${errorText}`);
        return;
      }
      if (response.ok) {
        console.log(response);
        fetchDocuments();
      }
    } catch (errorMsg) {
      console.error(errorMsg);
    }
  }

  function toggleCreateDocument() {
    setCreateToggle(!createToggle);
  }

  function createDocument(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    postDocument(title);
  }

  return (
    <>
      <h1>DocEditor Incorperated</h1>
      <div className="utility-bar">
        <button className="button-blue" onClick={toggleCreateDocument}>
          Add +
        </button>
      </div>
      <div className="doc-create">
        {createToggle && (
          <form onSubmit={createDocument} className="doc-form">
            <label>Title</label>
            <input
              type="text"
              name="Title"
              placeholder="My Title"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <input
              type="checkbox"
              checked={code}
              onChange={(e) => setCode(e.target.checked)}
            />{' '}
            Code?
            <button type="submit">Add</button>
          </form>
        )}
      </div>
      <div className="doc-container">
        {documents.map((doc) => {
          const linkPath = doc.code ? `/code/${doc.id}` : doc.id; // Change the link based on the `code` value

          return (
            <Link to={linkPath} key={doc.id}>
              <div className="doc-mini">
                <p className="doc-title">{doc.title}</p>
                {doc.code !== undefined && (
                  <p>{doc.code ? 'Code is enabled' : 'Code is disabled'}</p>
                )}
                <div className="doc-subtext-container">
                  <p className="doc-subtext">{doc.content}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default App;
