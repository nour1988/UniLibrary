import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Book } from './Models/book.model';
const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class BooksService {
  books: Array<Book>

  constructor(private httpClient: HttpClient) { }

  public getAllBooks(data:any) {
    return this.httpClient.get(`${API_URL}/books?query=${data.query}&type=${data.type}&author=${data.author}&genre=${data.genre}&year=${data.year}`);
  }
  public getAllGeneres() {
    return this.httpClient.get(`${API_URL}/genres`);
  }
  public getAllBookTypes() {
    return this.httpClient.get(`${API_URL}/book-types`);
  }
  public getAllAuthors() {
    return this.httpClient.get(`${API_URL}/authors`);
  }
  public deleteBook(id) {
    return this.httpClient.post(`${API_URL}/books/${id}`,{});
  }
  public addBook(book) {
    return this.httpClient.post(`${API_URL}/book`,book);
  }
  public getBook(id) {
    return this.httpClient.get(`${API_URL}/books/${id}`,{});
  }
  public editBook(book) {
    let id= book.book._id;
    console.log(id)
    return this.httpClient.post(`${API_URL}/books/${id}/edit`,book);
  }
  public reserveBooks(data) {
    return this.httpClient.post(`${API_URL}/books/reserve`,data);
  }
  public getReservations(data) {
    return this.httpClient.get(`${API_URL}/books/${data}/reservations`);
  }
  


}
