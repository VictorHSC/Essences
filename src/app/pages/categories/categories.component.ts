import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {

  categories: Observable<any>;
  collection = 'categories';

  constructor(private afs: AngularFirestore) {

    this.categories = this.read();
  }

  create() {

    this.afs.collection(this.collection).add({ name: 'Nova Categoria' });
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

  update(category: any) {

    this.afs.collection(this.collection).doc(category.id).update(category.data);
  }

  delete(category: any) {

    this.afs.collection(this.collection).doc(category.id).delete();
  }
}
