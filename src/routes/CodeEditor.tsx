import '../assets/App.css';
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import GraphQLqueries from '../GraphQLqueries';
import { createClient } from 'graphql-ws';

import Editor from '@monaco-editor/react';

function CodeEditor() {
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');

  const [userId, setUserId] = useState('');
  const { id } = useParams();

  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [codeLog, setCodeLog] = useState('Execute code to view');
  const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);

  const apiAddress = import.meta.env.VITE_API_ADDRESS;
  const wsApiAddress = import.meta.env.VITE_WS_API_ADDRESS;

  let debounceTimeout;

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function getValue() {
    return editorRef.current.getValue();
  }

  function setEditorContent(newContent: string) {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentCursorPosition = editor.getPosition();
      setCursorPosition(currentCursorPosition);
      setCode(newContent);
    }
  }
  
  // fixed cursor position in monaco
  useEffect(() => {
    if (editorRef.current && cursorPosition) {
      const editor = editorRef.current;
      editor.setPosition(cursorPosition);
      editor.revealLine(cursorPosition.lineNumber);
    }
  }, [code]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('Bearer');
        const query = GraphQLqueries.getUser();
        const response = await fetch(`${apiAddress}/query`, {
          method: 'POST',
          body: JSON.stringify({ query }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setUserId(result.data.user.id);
          console.log('USER ID2 IS: ', result.data.user.id);
        }
      } catch (errorMsg) {
        console.error(errorMsg);
      }
    };

    fetchUserId();
  }, [apiAddress]);

  useEffect(() => {
    if (userId && id) {
      const client = createClient({
        url: `${wsApiAddress}`,
      });

      client.on('connected', () => {
        console.log('WebSocket connected');
      });

      const subscription = client.subscribe(
        {
          query: `
            subscription ContentSubscription($documentId: String!, $userId: String!) {
                contentSubscription(documentId: $documentId, userId: $userId) {
                    Document {
                        id
                        title
                        content
                    }
                    userIdMakingChange
                }
            }
        `,
          variables: { documentId: id, userId },
        },
        {
          next(data) {
            const newData = data.data.contentSubscription.Document;
            const newDataFromUser =
              data.data.contentSubscription.userIdMakingChange;

            setTitle(newData.title);
            clearTimeout(debounceTimeout);

            // not unessescary saves
            if (newDataFromUser != userId) {
              debounceTimeout = setTimeout(() => {
                setEditorContent(newData.content);
              });
            }

          },
          error(err) {
            console.error('error in subscription:', err);
          },
          complete() {
            console.log('subscription completed');
          },
        }
      );
      console.log('SUBSCRIBO:', subscription);
    }
  }, [userId, id]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem('Bearer');
        const query = GraphQLqueries.getDocument(id);
        let result;
        const response = await fetch(`${apiAddress}/query`, {
          method: 'POST',
          body: JSON.stringify({ query }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (response.ok) {
          result = await response.json();
          setTitle(result.data.document.title);
          setCode(result.data.document.content);
        }
      } catch (errorMsg) {
          console.error(errorMsg);
      }
    };
    fetchDocument();
  }, []);

  async function updateDocument(newContent: string, newTitle: string) {
    try {
      if (!newTitle) {
        newTitle = title;
      }
      if (!newContent) {
        newContent = content;
      }
      const query = GraphQLqueries.updateDocument2(id, newContent, newTitle); // still backwards
      const token = localStorage.getItem('Bearer');
      const response = await fetch(`${apiAddress}/query`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ query }),
        method: 'POST',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error: ${response.status} - ${errorText}`);
        return;
      }
    } catch (errorMsg) {
      console.error(errorMsg);
    }
  }

  const handleInvite = async () => {
    //Quick and dirty style if have time
    if (!email) {
      alert('Please enter an email address.');
      return;
    }
    const addUsers = GraphQLqueries.addUsers([email], id); //singular..
    const token = localStorage.getItem('Bearer');

    try {
      const response = await fetch(`${apiAddress}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ query: addUsers }),
      });

      if (response.ok) {
        alert('Invitation sent successfully!');
        setEmail('');
      } else {
        const errorText = await response.text();
        console.log(`Error sending invitation: ${errorText}`);
        alert(`Error sending invitation: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send invitation. Please try again later.');
    }
  };

  async function sendCode() {
    try {
      const response = await fetch(`https://execjs.emilfolino.se/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: btoa(getValue()) }),
      });

      if (response.ok) {
        console.log('response ok');
        const res = await response.json();
        console.log('code sent res: ', res);
        const decoded = atob(res.data);
        setCodeLog(decoded);
        alert(decoded);
      } else {
        const errorText = await response.text();
        console.log(`Error sending code: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleEditorChange = (value) => {
    setCode(value);
    updateDocument(value, false);
  };


  return (
    <div className="document-container">
      <h1>Code</h1>
      <Link to={'/'}>
        <button className="button-blue margin-low">Return</button>
      </Link>
      <button className="button-blue" onClick={updateDocument}>
        Update
      </button>
      <div className="invite-user">
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="button-blue" onClick={handleInvite}>
          Invite
        </button>
      </div>
      <br />
      <br />
      <div className="single-doc-wrapper">
        <div className="single-doc-title">
          <textarea
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateDocument(false, e.target.value);
            }}
          />
        </div>
        <button className="button-blue" onClick={sendCode}>
          Execute
        </button>

        <div className="single-doc-content" style={{ display: 'block' }}>
          <Editor
            height="30vh"
            defaultLanguage="javascript"
            value={code}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
          />
          <div style={{ backgroundColor: '#008CFF', color: 'white' }}>
            {codeLog}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
