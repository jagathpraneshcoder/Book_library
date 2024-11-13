import React, { useState, useEffect } from 'react';
import '../components/styles/BookShelf.css'; // Add this file for custom styles

const BookShelf = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Function to fetch books from the Gutenberg API
  const fetchBooks = async () => {
    const response = await fetch(
      `https://gutendex.com/books?languages=en&limit=50`
    );
    const data = await response.json();

    // Extract relevant information from the Gutenberg API response
    const booksData = data.results.map((item) => ({
      id: item.id,
      title: item.title,
      author: item.authors.length > 0 ? item.authors[0].name : 'Unknown Author',
      genre: item.subjects.length > 0 ? item.subjects[0] : 'Unknown Genre',
      cover: item.formats['image/jpeg'] || 'https://via.placeholder.com/100x150?text=No+Cover',
    }));

    setBooks(booksData);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="bookshelf-container">
      <div className="book-details">
        {selectedBook ? (
          <div>
            <h3>{selectedBook.title}</h3>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            <img src={selectedBook.cover} alt={selectedBook.title} className="book-detail-cover" />
          </div>
        ) : (
          <p>Hover over a book to see details</p>
        )}
      </div>
      <div className="bookshelf">
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="bookshelf-row">
            {books.slice(rowIndex * 10, (rowIndex + 1) * 10).map(book => (
              <div
                key={book.id}
                className="book-item"
                onMouseEnter={() => setSelectedBook(book)}
                onMouseLeave={() => setSelectedBook(null)}
              >
                <img src={book.cover} alt={book.title} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookShelf;
