import '../assets/App.css'
import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom';
import GraphQLqueries from '../GraphQLqueries';
import postComment from '../api/postComment';

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

  //popup hell why am i doing this
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });

  const [comments, setComments] = useState([])
  const [currCommentLine, setCurrCommentLine] = useState(0)
  const [pendingCommentRange, setPendingCommentRange] = useState(null)

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
          setTitle(result.data.document.title)
          setContent(result.data.document.content)
          setComments(result.data.document.comments)

          if (contentRef.current) {
            contentRef.current.innerHTML = result.data.document.content;
          }
        }

      } catch (errorMsg) {
        console.error(errorMsg)
      }
    }
    fetchDocument()
  }, []);

  // Moving to useeffect cause it wasnt working cause setstate is like async??
  useEffect(() => {
    const spans = document.querySelectorAll('span.highlight');
    spans.forEach(span => {
        span.addEventListener('mouseover', () => {
            const commentId = span.id;
            const comment = getCommentById(commentId);
            setTooltipContent(comment);
            setTooltipVisible(true);
            
            const rect = span.getBoundingClientRect();
            setTooltipPosition({
                left: rect.left,
                top: rect.bottom + window.scrollY
            });
        });

        span.addEventListener('mouseout', () => {
            setTooltipVisible(false);
        });
    });

    return () => {
        spans.forEach(span => {
            span.removeEventListener('mouseover', () => {});
            span.removeEventListener('mouseout', () => {});
        });
    };
  }, [comments]);
  

  const getCommentById = (commentId: string) => {
    const comment = comments.find(comment => comment.line === commentId);
    return comment ? comment.comment : 'No comment found';
  }

  const handleDivAreaSelection = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const mainDiv = document.getElementsByClassName("div-textarea")[0];
    const children = mainDiv.children;
  
    if (selectedText) {
      let found;
      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
  
      for (let i = 0; i < children.length; i++) { //remove all this later
        if (children[i].contains(startNode)) {
          found = true;
          setCurrCommentLine(i + 2);
          console.log("Selected line: ", i + 2, children[i].innerHTML);
          break;
        }
      }

      setPendingCommentRange(range)

      const rect = range.getBoundingClientRect();
      setPopupPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
      setPopupVisible(true);
  
      if (!found) {
        setCurrCommentLine(1); // Set to 1 for first line this shit still buggy af
      }
    }
  };


  async function updateDocument() {
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
        const errorText = await response.text();
        console.error(`Error: ${response.status} - ${errorText}`);
        return;
      }
    } catch (errorMsg) {
      console.error(errorMsg)
    }
  }

  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML)
    }
  };

  const handleCommentSubmit = (comment, lineNumber) => {
    const existingComment = comments.find(comment => comment.line === lineNumber);

    if (pendingCommentRange) {
      const timestamp = Date.now().toString()
      const span = document.createElement("span");

      span.classList.add("highlight");
      span.setAttribute('id', timestamp)
      postComment.addComment(id, comment, timestamp)
      pendingCommentRange.surroundContents(span);

      setComments([...comments, { id: 'temp', comment: comment, line: timestamp }]);
      clearSelection()
    }
    
    if (existingComment) {
      alert(`A comment already exists for line ${lineNumber}.`);
      return;
    }
  };


  const closePopup = () => {
    setPopupVisible(false);
    clearSelection()
  };

  function clearSelection() {
    const selection = window.getSelection();
    selection.removeAllRanges();
}

 
  return (
    <div className="document-container">
      <Link to={"/"}><button className='button-blue margin-low'>Return</button></Link>
      <button className='button-blue' onClick={updateDocument}>Update</button>
      <br /><br />
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
            onMouseUp={handleDivAreaSelection}
            style={{
              padding: '10px',
              minHeight: '100px',
              position: 'relative',
              width: '75%',
            }}
          />
                      {tooltipVisible && (
                <div 
                    className="tooltip" 
                    style={{
                        position: 'absolute', 
                        left: tooltipPosition.left,
                        top: tooltipPosition.top,
                        backgroundColor: 'white', 
                        border: '1px solid black', 
                        padding: '5px', 
                        zIndex: 1000,
                    }}
                >
                    {tooltipContent}
                </div>
            )}
          {/* <div className='comments-container'>
            {comments.map((comment, index) => (
              <div key={index} className='comment' style={{ top: `${(comment.line - 1) * 30}px` }}>
                <span>Line {comment.line}: {comment.comment}</span>
              </div>
            ))}
          </div> */}
        </div>
        {popupVisible && (
          <CommentPopup 
            position={popupPosition} 
            onClose={closePopup} 
            onCommentSubmit={handleCommentSubmit}
            commentLine={currCommentLine}
          />
        )}
      </div>
    </div>
  );
}


export default Document