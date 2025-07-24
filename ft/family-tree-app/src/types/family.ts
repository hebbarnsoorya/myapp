export interface FamilyMember {
  name: string;
  birth?: number;
  death?: number;
  children?: FamilyMember[];
}
