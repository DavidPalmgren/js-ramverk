import '../assets/App.css'
import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom';
import GraphQLqueries from '../GraphQLqueries';

// change to own module maybe?
const CommentPopup = ({ position, onClose, onCommentSubmit, commentLine }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment) {
      onCommentSubmit(comment, commentLine);
      setComment('');
    }
    onClose();
  };

  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        padding: '10px',
        zIndex: 1000,
      }}
    >
      <p>Line {commentLine}</p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        cols={30}
        placeholder="Add a comment..."
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

function Document() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const contentRef = useRef(null);
  const { id } = useParams()

  const [popupVisible, setPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  const [currCommentLine, setCurrCommentLine] = useState(0)
  const [comments, setComments] = useState([])

  const apiAddress = import.meta.env.VITE_API_ADDRESS

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem('Bearer')
        console.log('id is defined and is : ', id)
        const query = GraphQLqueries.getDocument(id)
        let result
        const response = await fetch(`${apiAddress}/query`, {
          method: "POST",
          body: JSON.stringify({ query }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        })
        if (response.ok) {
          result = await response.json()
          console.log('new graphql test res is : ', result)
          setTitle(result.data.document.title)
          setContent(result.data.document.content)
        }
        if (contentRef.current) {
          contentRef.current.innerHTML = result.data.document.content;
        }
      } catch (errorMsg) {
        console.error(errorMsg)
      }
    }
    fetchDocument()
  }, []);


  const handleDivAreaSelection = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const mainDiv = document.getElementsByClassName("div-textarea")[0];
    const children = mainDiv.children;

    if (selectedText) {
        let found
        let commentLine
        const range = selection.getRangeAt(0);
        const startNode = range.startContainer;

        for (let i = 0; i < children.length; i++) {
            if (children[i].contains(startNode)) {
                console.log(`Selected line: ${i + 2}`, children[i].innerHTML); //+1 for non-idx, +1 for first line not being a div for some reason
                found = true
                setCurrCommentLine(i + 2)
                console.log("currcomment set on line " + currCommentLine)
                break;
            }
        }
        
        const rect = range.getBoundingClientRect();
        setPopupPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
        setPopupVisible(true); // Show the popup

        if (!found) {
          console.log(`Selected line: ${1}`, children[0].innerHTML); //+1 for non-idx, +1 for first line not being a div for some reason
          setCurrCommentLine(1) // set to 1 for first line
        }
    }
};


  async function updateDocument() {
    
    console.log('button pressed')
    console.log(title)
    console.log(content)
    try {
      const query = GraphQLqueries.updateDocument(id, content, title) // still backwards
      const token = localStorage.getItem('Bearer')
      
      const response = await fetch (`${apiAddress}/query`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ query }),
        method: "POST"
      })
      if (!response.ok) {
        const errorText = await response.text(); // raw is better for debugging lulw
        console.error(`Error: ${response.status} - ${errorText}`);
        return;
      } else {
        console.log('OK')
        console.log(response)
      }
    } catch (errorMsg) {
      console.error(errorMsg)
    }
  }

  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML); // Update state with new content
    }
  };

  const handleCommentSubmit = (comment, lineNumber) => {
    setComments([...comments, { line: lineNumber, text: comment }]);
    console.log("comments: ", comments)
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <>
    <Link to={"/"}><button className='button-blue margin-low'> Return</button></Link>
    <button className='button-blue' onClick={updateDocument}>Update</button>
    <br></br>
    <br></br>
      <div className='single-doc-wrapper'>
        <div className='single-doc-title'>
          <textarea
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
         <div className='single-doc-content'>
           <div
            className='div-textarea'
            contentEditable
            ref={contentRef}
            onInput={handleContentChange}
            onMouseUp={(e) => handleDivAreaSelection(e)}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              minHeight: '100px',
            }}
          />
        </div>
        {popupVisible && (
          <CommentPopup 
            position={popupPosition} 
            onClose={closePopup} 
            onCommentSubmit={handleCommentSubmit}
            commentLine={currCommentLine} // problem?
          />
        )}
        {/* temp display remove later */}
        <div className='comments-section'>
          <h3>Comments:</h3>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className='comment'>
                Line {comment.line}: {comment.text}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </>
  )
}


export default Document