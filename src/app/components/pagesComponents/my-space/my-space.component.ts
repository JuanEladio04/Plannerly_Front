import { Component, OnInit } from '@angular/core';
import { WorkSpace } from '../../../interfaces/work-space';
import { WorkSpaceService } from '../../../services/work-space.service';
import { Notas } from '../../../interfaces/nota';
import { NotaService } from '../../../services/nota.service';
import { Answer } from '../../../interfaces/answer';
import { DeleteWorkSpaceModalComponent } from '../../smallComponents/delete-work-space-modal/delete-work-space-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeletePublicationModalComponent } from '../../smallComponents/delete-publication-modal/delete-publication-modal.component';
import { Tarea } from '../../../interfaces/tarea';
import { TareaService } from '../../../services/tarea.service';
import { Recordatorio } from '../../../interfaces/recordatorio';
import { RecordatorioService } from '../../../services/recordatorio.service';

@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrl: './my-space.component.scss',
})
export class MySpaceComponent {
  editingPublicationId: number | null = null;

  workSpace: WorkSpace = {
    id: -1,
    name: '',
    description: '',
  };

  notas: Notas[] = [];
  tareas: Tarea[] = [];
  recordatorios : Recordatorio[] = [];

  nNota: Notas = {
    pId: -1,
    title: '',
    subtitle: '',
    content: '',
  };

  nTarea: Tarea = {
    pId: -1,
    name: '',
    state: 'Pendiente',
    description: '',
  };

  nRecordatorio : Recordatorio = {
    pId: -1,
    title: '',
    date: '',
    hour: '',
    completed: 0,
  }

  constructor(
    private wkService: WorkSpaceService,
    private nService: NotaService,
    private tService: TareaService,
    private rService: RecordatorioService,
    private dialog: MatDialog
  ) {}

  toggleEditing(publicationId: number) {
    this.editingPublicationId =
      publicationId === this.editingPublicationId ? null : publicationId;
    this.getNotas(this.workSpace.id);
    this.getTareas(this.workSpace.id);
  }

  getSelectedWorkSpace(selectedWorkSpaceId: any) {
    this.wkService.findById(parseInt(selectedWorkSpaceId)).subscribe(
      (selectedWorkSpace: WorkSpace) => {
        this.workSpace = selectedWorkSpace;
      },
      (error: any) => {
        console.log('No es posible cargar el espacio de trabajo');
      }
    );

    this.getNotas(selectedWorkSpaceId);
    this.getTareas(selectedWorkSpaceId);
    this.getRecordatorios(selectedWorkSpaceId);
  }

  //**Notas****************************************************************************************************** */
  getNotas(workSpaceId: number) {
    this.nService.findByWorkSpaceId(workSpaceId).subscribe(
      (wkNotas: Notas[]) => {
        this.notas = wkNotas;
      },
      (error: any) => {
        console.log('No es posible cargar las notas');
      }
    );
  }

  createNota() {
    this.nService.createNota(this.workSpace.id, this.nNota).subscribe(
      (result: Answer) => {
        if (result.result == 'success') {
          this.getNotas(this.workSpace.id);
          this.nNota = {
            pId: -1,
            title: '',
            subtitle: '',
            content: '',
          };
        } else {
          console.log(result.result);
        }
      },
      (error: any) => {
        console.log('No es posible crear nota');
      }
    );
  }

  updateNota(nota: Notas) {
    this.nService.updateNota(nota).subscribe(
      (result: Answer) => {
        if (result.result == 'success') {
          this.getNotas(this.workSpace.id);
        } else {
          console.log(result.result);
        }
      },
      (error: any) => {
        console.log('No es posible actualizar nota');
      }
    );
  }

  //**Tareas****************************************************************************************************** */
  getTareas(workSpaceId: number) {
    this.tService.findByWorkSpaceId(workSpaceId).subscribe(
      (wkTareas: Tarea[]) => {
        this.tareas = wkTareas;
      },
      (error: any) => {
        console.log('No es posible cargar las tareas');
      }
    );
  }

  createTarea() {
    this.tService.createTarea(this.workSpace.id, this.nTarea).subscribe(
      (result: Answer) => {
        if (result.result == 'success') {
          this.getTareas(this.workSpace.id);
          this.nTarea = {
            pId: -1,
            name: '',
            state: 'Pendiente',
            description: '',
          };
        } else {
          console.log(result.result);
        }
      },
      (error: any) => {
        console.log('No es posible crear tarea');
      }
    );
  }

  updateTarea(tarea: Tarea) {
    this.tService.updateTarea(tarea).subscribe(
      (result: Answer) => {
        if (result.result == 'success') {
          this.getTareas(this.workSpace.id);
        } else {
          console.log(result.result);
        }
      },
      (error: any) => {
        console.log('No es posible actualizar tarea');
      }
    );
  }

  //**Recordatorio****************************************************************************************************** */
  getRecordatorios(workSpaceId: number) {
    this.rService.findByWorkSpaceId(workSpaceId).subscribe(
      (wkRecordatorios: Recordatorio[]) => {
        this.recordatorios = wkRecordatorios;
      },
      (error: any) => {
        console.log('No es posible cargar los recordatorios');
      }
    );
  }

  createRecordatorio() {
    this.rService.createRecordatorio(this.workSpace.id, this.nRecordatorio).subscribe(
      (result: Answer) => {
        if (result.result == 'success') {
          this.getRecordatorios(this.workSpace.id);
          this.nRecordatorio = {
            pId: -1,
            title: '',
            date: '',
            hour: '',
            completed: 0,
          };
        } else {
          console.log(result.result);
        }
      },
      (error: any) => {
        console.log('No es posible crear recordatorio');
      }
    );
  }

  updateRecordatorio(recordatorio: Recordatorio) {
    this.rService.updateRecordatorio(recordatorio).subscribe(
      (result: Answer) => {
        if (result.result == 'success') {
          this.getRecordatorios(this.workSpace.id);
        } else {
          console.log(result.result);
        }
      },
      (error: any) => {
        console.log('No es posible actualizar recordatorio');
      }
    );
  }

  toggleComplete(reminder : Recordatorio) {
    if(reminder.completed == 1){
      reminder.completed = 0;
    }
    else{
      reminder.completed = 1;
    }

    this.updateRecordatorio(reminder);
  }

  /**Delete publication *************************************************************************** */
  openDeletePublicationModal(publicationId: number) {
    const dialogRef = this.dialog.open(DeletePublicationModalComponent, {
      data: { pId: publicationId },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'success') {
        this.getNotas(this.workSpace.id);
        this.getTareas(this.workSpace.id);
        this.getRecordatorios(this.workSpace.id);
      }
    });
  }
}
