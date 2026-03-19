import { ContactData } from "../types";

export interface BusinessCardTemplateProps {
  data: ContactData;
  color: string;
  selectedFields: string[];
  compact?: boolean;
  baseClass?: string;
}
