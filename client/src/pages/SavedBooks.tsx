/*
 * SavedBooks page
 *
 * SavedBooks handles removing books from the user's saved books list.
 * 
 * It executes the GraphQL REMOVE_BOOK mutation to delete a book from the user's list.
 * The GET_ME query is used to retrieve the current user data, including their current saved books list.
 * It verifies the jwt token is valid before making a request to delete the book.
 * After removing a book, the component updates the saved list and removes the book from local storage.
 * 
 */
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries'; // Import the GET_ME query
import { REMOVE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  // Use useQuery hook to get user data
  const { loading, error, data } = useQuery(GET_ME);
  
  // Use the REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // If data is loading, display loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // If there is an error, display error message
  if (error) {
    return <h2>Error: {error.message}</h2>;
  }

  const userData: User = data?.me || {}; // Use data from GET_ME query

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeBook({
        variables: { bookId },
      });

      if (!response.data) {
        throw new Error('something went wrong!');
      }

      // Remove book's id from localStorage after successful mongo update
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
