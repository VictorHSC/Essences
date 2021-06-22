import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Essence {
  id?: number;
  brand?: string,
  flavor?: string,
  description?: string,
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  items: Observable<any[]>;

  constructor(private afs: AngularFirestore) {
    this.items = afs
      .collection('containers', (ref) => ref.orderBy('id', 'asc'))
      .valueChanges();
  }

  resetContainer(item: Essence) {
    const emptyEssence = {
      brand: '',
      description: '',
      id: item.id,
      flavor: '',
    };

    this.updateContainer(emptyEssence);
  }

  updateContainer(item: Essence) {
    const doc = this.afs
      .collection('containers', (ref) => ref.where('id', '==', item.id))
      .snapshotChanges()
      .subscribe((res) => {
        this.afs
          .collection('containers')
          .doc(res[0].payload.doc.id)
          .update({
            brand: item.brand,
            description: item.description,
            flavor: item.flavor,
          })
          .then(() => {
            doc.unsubscribe();
          });
      });
  }
}
