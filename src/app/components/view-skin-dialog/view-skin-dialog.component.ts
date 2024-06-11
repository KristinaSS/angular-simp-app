import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Skin} from "../../models/skin";

@Component({
  selector: 'app-view-skin-dialog',
  templateUrl: './view-skin-dialog.component.html',
  styleUrl: './view-skin-dialog.component.css'
})
export class ViewSkinDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public skin: Skin) {}
}
