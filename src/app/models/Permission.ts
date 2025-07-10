export interface Permission {
  userId: number;
  interfaceName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}