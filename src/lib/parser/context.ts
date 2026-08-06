import { EDILine } from "@/types/edi";
import type { Party, Reference, DateField, Package } from "./types";

export type ParserContext = {
  messageType: string;
  version: string | null;

  documentNumber: string | null;
  documentDate: string | null;
  dispatchDate: string | null;
  deliveryDate: string | null;
  currency: string | null;

  buyer: string | null;
  supplier: string | null;
  deliveryPoint: string | null;
  invoiceRecipient: string | null;

  orderNumber: string | null;
  deliveryNote: string | null;

  packageStack: Package[];
  packageMap: Map<number, Package>;
  packageCount: number;
  palletCount: number;
  ssccCount: number;
  grossWeight: string | null;

  lines: EDILine[];
  currentLine: EDILine | null;

  currentPackage: Package | null;

  nextPackageId: number;

  partiesList: Party[];

  referencesList: Reference[];

  dates: DateField[];

  packages: Package[];
};

export function createParserContext(): ParserContext {
  return {
    messageType: "",
    version: null,

    documentNumber: null,
    documentDate: null,
    dispatchDate: null,
    deliveryDate: null,
    currency: null,

    buyer: null,
    supplier: null,
    deliveryPoint: null,
    invoiceRecipient: null,

    orderNumber: null,
    deliveryNote: null,
    packageStack: [],
    packageCount: 0,
    palletCount: 0,
    ssccCount: 0,
    grossWeight: null,

    lines: [],
    currentLine: null,
    currentPackage: null,
    nextPackageId: 1,
    partiesList: [],

    referencesList: [],

    dates: [],

    packages: [],
    packageMap: new Map(),
  };
}
