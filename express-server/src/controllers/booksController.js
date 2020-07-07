const mongoose = require('mongoose');
const Book = require("../models/booksModel.js")(mongoose);
const Genre = require("../models/genreModel.js")(mongoose);
const BookType = require("../models/bookTypeModel.js")(mongoose);
const Author = require("../models/authorModel.js")(mongoose);
const Reservation = require("../models/reservationModel.js")(mongoose);
const User = require("../models/users.js")(mongoose);
class BooksController {
	/* Method to return all the books in the database books collection */
	static async getAllBooks(req, res) {

		console.log("get all books was called")

		const query = req.query.query == "" ? null : req.query.query

		const genre = req.query.genre == "" ? null : req.query.genre
		const type = req.query.type == "" ? null : req.query.type
		const year = req.query.year == "" ? null : parseInt(req.query.year)
		const author = req.query.author == "" ? null : req.query.author

		var requestData = [];
		let Books = []
		if (query)
			requestData.push({ title: new RegExp(query, 'i') });
		if (type)
			requestData.push({ bookType: type });
		if (year)
			requestData.push({ year: year });
		if (author)
			requestData.push({ author: author });
		if (genre)
			requestData.push({ genre: genre });

		if (requestData.length) {
			Books = await Book.find({ $and: requestData })
				.populate('genre', 'title').populate('author', 'name')
				.populate('bookType', 'title')
				;
		}
		else
		Books = await Book.find()
				.populate('genre', 'title').populate('author', 'name')
				.populate('bookType', 'title')
				;


		res.json(Books);
	};
	static async getAllGenres(req, res) {
		Genre.find({}, (err, Genres) => {
			if (err) res.status(500).send(error)
			res.json(Genres);
		});
	};
	static async getAllBookTypes(req, res) {
		BookType.find({}, (err, BookTypes) => {
			if (err) res.status(500).send(error)
			res.json(BookTypes);
		});
	};
	static async getAllAuthors(req, res) {
		Author.find({}, (err, Authors) => {
			if (err) res.status(500).send(error)
			res.json(Authors);
		});
	};

	// Add new genre
	static async addNewGenre(req, res) {
		var genre = new Genre({
			title: req.body.title
		});

		genre.save(error => {
			if (error) res.status(500).send(error);
			res.status(201).json({
				message: 'Genre created successfully'
			});
		});
	};
	// Add new book type
	static async addBookType(req, res) {
		var bookType = new BookType({
			title: req.body.title
		});
		bookType.save(error => {
			if (error) res.status(500).send(error);
			res.status(201).json({
				message: 'book type created successfully'
			});
		});
	};
	// Add new author
	static async addNewAuthor(req, res) {
		var author = new Author({
			name: req.body.name
		});
		author.save(error => {
			if (error) res.status(500).send(error);
			res.status(201).json({
				message: 'Author created successfully'
			});
		});
	};

	// Add new book
	static async addNewBook(req, res) {

		const authorById = await Author.findById(req.body.author);
		const genreById = await Genre.findById(req.body.genre);
		const bookTypeById = await BookType.findById(req.body.bookType);
		var book = new Book({
			title: req.body.title,
			year: req.body.year,
			image: req.body.image,
			status: req.body.status,
			genre: genreById._id,
			author: authorById._id,
			bookType: bookTypeById._id,
			format: req.body.format
		});
		book.save(error => {
			if (error) res.status(500).send(error);
			res.status(201).json({
				message: 'Book created successfully'
			});
		});
	};
		// Reserve a book
		static async reserve(req, res) {

			const userByUsername = await User.findOne({'username':req.body.username});

			 req.body.books.forEach(async book => { 
				const bookById = await Book.findById(book);
				console.log(userByUsername)
				var reservation = new Reservation({
					from: req.body.from,
					to: req.body.to,
					user: userByUsername._id,
					book: bookById._id,
				});
				reservation.save(error => {
					console.log(error)
				});
			  }); 
			
		};
		static async reservations(req, res) {

			let reservations = await Reservation.find({'book':req.params.bookId})
			.populate('user', 'username')
			;
			res.status(200).json({
				reservations
			});
			
		};
		

	//Delete a book
	static async deleteBook(req, res) {
		Book.deleteOne({ _id: req.params.bookId }, function (err) {
			if (err) return handleError(err);
			res.status(204).json({
				message: 'Book deleted successfully'
			});
		  })
	}
   //getBook a book
		static async getBook(req, res) {
			let book = await Book.findById(req.params.bookId)
				.populate('genre', 'title').populate('author', 'name')
				.populate('bookType', 'title')
				;
				res.json(book);
		}
		 //edit a book
		 static async editBook(req, res) {
			 
			let book = await Book.findOneAndUpdate({_id:req.body.book._id}, req.body.book, {
				new: true,
				upsert: true 
			  });
			  res.status(200).json({
				message: 'Book updated successfully'
			});
		}


	

}


/** Exporting user routes */
module.exports = BooksController;


