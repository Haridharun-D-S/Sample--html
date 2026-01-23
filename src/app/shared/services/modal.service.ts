import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private modals = [];

  add(modal) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(modalEl => modalEl.id !== id);
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.filter(modalEl => modalEl.id === id)[0];
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    const modal = this.modals.filter(modalEl => modalEl.id === id)[0];
    modal.close();
  }
}
