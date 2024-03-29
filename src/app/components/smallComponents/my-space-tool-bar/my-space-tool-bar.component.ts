import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WorkSpace } from './../../../interfaces/work-space';
import { NewWorkSpaceModalComponent } from '../new-work-space-modal/new-work-space-modal.component';
import { WorkSpaceService } from './../../../services/work-space.service';
import { DeleteWorkSpaceModalComponent } from '../delete-work-space-modal/delete-work-space-modal.component';
import { AccessWorkSpaceModalComponent } from '../access-work-space-modal/access-work-space-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-space-tool-bar',
  templateUrl: './my-space-tool-bar.component.html',
  styleUrls: ['./my-space-tool-bar.component.scss']
})
export class MySpaceToolBarComponent implements OnInit {
  workSpaces: WorkSpace[] = [];

  @Output() workSpaceSelected = new EventEmitter<WorkSpace>();
  workSpaceId : number = -1;

  constructor(
    private workSpaceService: WorkSpaceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getWorkSpaces();
  }

  public getWorkSpaces() {
    this.workSpaceService.findByUser().subscribe(
      (workSpaces: WorkSpace[]) => {
        this.workSpaces = workSpaces;
      },
      (error) => {
        console.error('Error al cargar los espacios de trabajo:', error);
      }
    );
  }

  openNewWorkSpaceModal(): void {
    const dialogRef = this.dialog.open(NewWorkSpaceModalComponent, {
      width: '500px',
    });
  }

  openDeleteWorkSpaceModal(): void {
    const dialogRef = this.dialog.open(DeleteWorkSpaceModalComponent, {
      data: { 'workSpaceId': this.workSpaceId }
    });
  }

  openAccessWorkSpaceModal(): void {
    const dialogRef = this.dialog.open(AccessWorkSpaceModalComponent, {
      data: { 'workSpaceId': this.workSpaceId }
    });
  }

  getSelectedWorkSpace(event: any) {
    this.workSpaceSelected.emit(event); 
    this.workSpaceId = event;
  }
}
