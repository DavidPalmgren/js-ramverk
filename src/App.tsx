import './assets/App.css'
import { useEffect, useState } from 'react'
import graphQLqueries from "./GraphQLqueries.tsx";
import { Link } from 'react-router-dom'

function App() {
  const apiAddress = import.meta.env.VITE_API_ADDRESS

  const [documents, setDocuments] = useState([])

  const [createToggle, setCreateToggle] = useState(false)
  const [title, setTitle] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("Bearer")
        const query = graphQLqueries.getUser();
        const response = await fetch(`${apiAddress}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({ query })
        });
  
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.data.user.documents);
          console.log(data.data.user.documents)
        } else {
          const errorText = await response.text();
          console.error(`Error: ${response.status} ,  ${errorText}`);
        }
      } catch (errorMsg) {
        console.error(errorMsg);
      }
    };
  
    fetchDocuments();
  }, []);

  async function postDocument(title: string) { //content removed now just blank default
    try {
      const token = localStorage.getItem("Bearer")
      const query = graphQLqueries.createDocument(title);
      console.log('token: ' + token)
      console.log(query)
      const response = await fetch(`${apiAddress}/query`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        },
        body: JSON.stringify({ query }),
        method: "POST"
      })
      if (!response.ok) {
        const errorText = await response.text(); // raw is better for debugging lulw
        console.error(`Error: ${response.status} - ${errorText}`);
        return;
      }
      console.log(response)
      const data = await response.json()
      console.log(`Document has been created succesfully :), ${data}`)
    } catch (errorMsg) {
      console.error(errorMsg)
    }
  }

  function toggleCreateDocument() {
    setCreateToggle(!createToggle)
  }

  function createDocument(e:React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    postDocument(title)
  }


  return (
    <>

      <h1>DocEditor Incorperated</h1>
      <div className='utility-bar'>
        <button className='button-blue' onClick={toggleCreateDocument}>Add +</button>
      </div>
      <div className='doc-create'>
        {createToggle && (
          
            <form onSubmit={createDocument} className='doc-form'>
              <label>Title</label>
              <input type="text" name="Title" placeholder='My Title' onChange={(e) => setTitle(e.target.value)}></input>
              <button type="submit">Add</button>
            </form>
          
        )}
      </div>
      <div className='doc-container'>
      {documents.map(doc => (
        <Link to={doc.id}>
        <div className='doc-mini' key={doc.id}>
          <p className='doc-title'>
            {doc.title}
          </p>
          <div className='doc-subtext-container'>
            <p className='doc-subtext'>
              {doc.content}
            </p>
          </div>

          </div>
          </Link>
      ))}
      </div>
    </>
  )
}

export default App
