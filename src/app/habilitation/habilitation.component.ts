import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PermissionService } from '../Services/permissions.service';
import { Location } from '@angular/common';
import { UserService } from '../Services/user.service';
import { Role } from '../role';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-habilitation',
  templateUrl: './habilitation.component.html',
  styleUrls: ['./habilitation.component.css']
})
export class HabilitationComponent implements OnInit {
  permissionForm!: FormGroup;
  userId: number[] =[];
  constructor(private fb: FormBuilder, private permissionService: PermissionService,private location: Location, private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.permissionForm = this.fb.group({
      accueil_view: [false],
      accueil_add: [false],
      accueil_edit: [false],
      accueil_delete: [false],

      hotel_view: [false],
      hotel_add: [false],
      hotel_edit: [false],
      hotel_delete: [false],

      chambres_view: [false],
      chambres_add: [false],
      chambres_edit: [false],
      chambres_delete: [false],

      reservation_view: [false],
      reservation_add: [false],
      reservation_edit: [false],
      reservation_delete: [false],

      paiement_view: [false],
      paiement_add: [false],
      paiement_edit: [false],
      paiement_delete: [false],
    });

    // Charger les permissions du backend si besoin :
    this.userService.getUsersByRole(Role.CLIENT).subscribe((data: any) => {
      data.map((user: User)=>{
        this.userId.push(user.id)
        this.permissionService.getPermissionsByUser(user.id).subscribe(data => {
        for (const perm of data) {
          const prefix = this.mapToControlPrefix(perm.interfaceName); // helper
          if (prefix) {
            this.permissionForm.patchValue({
              [`${prefix}_view`]: perm.canView,
              [`${prefix}_add`]: perm.canAdd,
              [`${prefix}_edit`]: perm.canEdit,
              [`${prefix}_delete`]: perm.canDelete
            });
          }
        }
      });
      }
    )
    });
  }

  mapToControlPrefix(name: string): string | null {
    switch (name) {
      case "Page d'accueil": return 'accueil';
      case 'Hôtel': return 'hotel';
      case 'Chambres': return 'chambres';
      case 'Réservation': return 'reservation';
      case 'Paiement': return 'paiement';
      default: return null;
    }
  }

onSave(): void {
  const formValue = this.permissionForm.value;
  const payload: any[] = [];

  this.userId.forEach((id: number) => {
    const permissionsForUser = [
      {
        userId: id,
        interfaceName: "Page d'accueil",
        canView: formValue.accueil_view,
        canAdd: formValue.accueil_add,
        canEdit: formValue.accueil_edit,
        canDelete: formValue.accueil_delete,
      },
      {
        userId: id,
        interfaceName: "Hôtel",
        canView: formValue.hotel_view,
        canAdd: formValue.hotel_add,
        canEdit: formValue.hotel_edit,
        canDelete: formValue.hotel_delete,
      },
      {
        userId: id,
        interfaceName: "Chambres",
        canView: formValue.chambres_view,
        canAdd: formValue.chambres_add,
        canEdit: formValue.chambres_edit,
        canDelete: formValue.chambres_delete,
      },
      {
        userId: id,
        interfaceName: "Réservation",
        canView: formValue.reservation_view,
        canAdd: formValue.reservation_add,
        canEdit: formValue.reservation_edit,
        canDelete: formValue.reservation_delete,
      },
      {
        userId: id,
        interfaceName: "Paiement",
        canView: formValue.paiement_view,
        canAdd: formValue.paiement_add,
        canEdit: formValue.paiement_edit,
        canDelete: formValue.paiement_delete,
      },
    ];

    payload.push(...permissionsForUser);
  });

  this.permissionService.savePermissions(payload).subscribe({
    next: () => this.toastr.success('<span class="toast-msg">Permissions modifiées avec succès</span>', '', {
      timeOut: 6000,
      progressBar: true,
      enableHtml: true
    }),
    error: (error: any) => {
      console.error("Erreur lors de l’enregistrement :", error);
      this.toastr.error('<span class="toast-msg">Erreur lors de la sauvegarde', '', {
        timeOut: 5000,
        enableHtml: true
      });
    }
  });
}


  goBack(): void {
    this.location.back();
  }
}
