export interface PropertyComment {
  id: number;
  propertyId: number;
  userId: number;
  userName: string;
  text: string;
  parentId: number | null;
  createdAt: string;
}
