import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  incenses: Observable<any>;
  categories: Observable<any>;
  collection = 'incenses';

  constructor(private afs: AngularFirestore) {

    this.incenses = this.read();
    this.categories = this.readCategorias();
  }

  create() {

    this.afs.collection(this.collection).add({ name: 'Novo Incenso' });
  }

  read() {

    return this.afs.collection(this.collection, (ref) => ref.orderBy('name', 'asc')).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return { id, data };
      });
    }));
  }

  readCategorias() {

    return this.afs.collection('categories', (ref) => ref.orderBy('name', 'asc')).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return { id, data };
      });
    }));
  }

  update(category: any) {

    this.afs.collection(this.collection).doc(category.id).update(category.data);
  }

  delete(category: any) {

    this.afs.collection(this.collection).doc(category.id).delete();
  }
}
