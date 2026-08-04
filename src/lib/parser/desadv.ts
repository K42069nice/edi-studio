import {
  DesadvDocument,
  DesadvItem,
  DesadvPackage,
} from "@/types/desadv";

export function parseDesadv(content: string): DesadvDocument {
  const lines = content
    .split("'")
    .map((line) => line.trim())
    .filter(Boolean);

  const document: DesadvDocument = {
    document: {
      messageNumber: null,
      orderNumber: null,
      deliveryNote: null,
      despatchDate: null,
      deliveryDate: null,
      version: null,
    },

    parties: {
      buyer: null,
      supplier: null,
      invoiceRecipient: null,
      deliveryPoint: null,
      finalRecipient: null,
    },

    logistics: {
      packageCount: 0,
      palletCount: 0,
      ssccCount: 0,
      grossWeight: 0,
    },

    packages: [],

    items: [],
  };

  let currentPackage: DesadvPackage | null = null;

  let currentItem: DesadvItem | null = null;

  let awaitingSSCC = false;
  let awaitingBatch = false;
  let awaitingExpiry = false;

  for (const segment of lines) {
    const parts = segment.split("+");

    switch (parts[0]) {
      case "UNH": {
        document.document.version =
          parts[2]?.split(":")[2] ?? null;

        break;
      }

      case "BGM": {
        document.document.messageNumber =
          parts[2] ?? null;

        break;
      }

      case "DTM": {
        const values = parts[1]?.split(":");

        if (!values) break;

        switch (values[0]) {
          case "137":
            document.document.despatchDate =
              values[1] ?? null;
            break;

          case "17":
            document.document.deliveryDate =
              values[1] ?? null;
            break;

          case "361":
            if (currentItem) {
              currentItem.expiry =
                values[1] ?? null;
            }
            break;
        }

        break;
      }

      case "RFF": {
        const values = parts[1]?.split(":");

        if (!values) break;

        switch (values[0]) {
          case "ON":
            document.document.orderNumber =
              values[1] ?? null;
            break;

          case "DQ":
            document.document.deliveryNote =
              values[1] ?? null;
            break;
        }

        break;
      }

      case "NAD": {
        switch (parts[1]) {
          case "BY":
            document.parties.buyer =
              parts[2] ?? null;
            break;

          case "SU":
            document.parties.supplier =
              parts[2] ?? null;
            break;

          case "IV":
            document.parties.invoiceRecipient =
              parts[2] ?? null;
            break;

          case "DP":
            document.parties.deliveryPoint =
              parts[2] ?? null;
            break;

          case "UC":
            document.parties.finalRecipient =
              parts[2] ?? null;
            break;
        }

        break;
      }

      case "PAC": {
        document.logistics.packageCount++;

        if (parts[2]?.startsWith("201")) {
          document.logistics.palletCount++;
        }

        break;
      }
            case "CPS": {
        currentPackage = {
          sscc: "",
          weight: null,
          type: null,
          items: [],
        };

        document.packages.push(currentPackage);

        break;
      }

      case "MEA": {
        if (!currentPackage) break;

        const value = parts[3]?.split(":")[1];

        if (!value) break;

        currentPackage.weight = Number(value);

        document.logistics.grossWeight += Number(value);

        break;
      }

      case "PCI": {
        awaitingSSCC = false;
        awaitingBatch = false;
        awaitingExpiry = false;

        switch (parts[1]) {
          case "33E":
            awaitingSSCC = true;
            break;

          case "36E":
            awaitingBatch = true;
            break;

          case "39E":
            awaitingExpiry = true;
            break;
        }

        break;
      }

      case "GIN": {
        if (awaitingSSCC) {
          const sscc = parts[2];

          if (currentPackage) {
            currentPackage.sscc = sscc;

            document.logistics.ssccCount++;
          }

          if (currentItem) {
            currentItem.sscc = sscc;
          }
        }

        if (awaitingBatch && currentItem) {
          currentItem.batch = parts[2] ?? null;
        }

        break;
      }

      case "LIN": {
        currentItem = {
          line: Number(parts[1]),

          gtin:
            parts[3]?.split(":")[0] ??
            null,

          supplierCode: null,

          buyerCode: null,

          description: null,

          quantity: 0,

          freeQuantity: 0,

          batch: null,

          expiry: null,

          sscc: currentPackage?.sscc ?? null,
        };

        document.items.push(currentItem);

        if (currentPackage) {
          currentPackage.items.push(
            currentItem.line
          );
        }

        break;
      }

      case "PIA": {
        if (!currentItem) break;

        const value =
          parts[2]?.split(":")[0] ?? null;

        const qualifier =
          parts[2]?.split(":")[1];

        if (qualifier === "SA") {
          currentItem.supplierCode =
            value;
        }

        if (qualifier === "BP") {
          currentItem.buyerCode =
            value;
        }

        break;
      }

      case "IMD": {
        if (!currentItem) break;

        currentItem.description =
          parts[3]
            ?.replace(":::", "")
            ?.trim() ?? null;

        break;
      }

      case "QTY": {
        if (!currentItem) break;

        const values =
          parts[1]?.split(":");

        if (!values) break;

        switch (values[0]) {
          case "12":
            currentItem.quantity =
              Number(values[1]);
            break;

          case "192":
            currentItem.freeQuantity =
              Number(values[1]);
            break;
        }

        break;
      }
            case "UNT": {
        break;
      }

      case "UNZ": {
        break;
      }
    }
  }

  // Удаляем пустые упаковки
  document.packages = document.packages.filter(
    (pkg) =>
      pkg.sscc ||
      pkg.items.length > 0 ||
      pkg.weight !== null
  );

  // Сортируем товары по номеру строки
  document.items.sort((a, b) => a.line - b.line);

  // Если вес не найден — считаем только по имеющимся данным
  document.logistics.grossWeight =
    Number(document.logistics.grossWeight.toFixed(3));

  // Пересчитываем количество SSCC
  document.logistics.ssccCount =
    document.packages.filter((pkg) => pkg.sscc).length;

  // Пересчитываем количество упаковок
  document.logistics.packageCount =
    document.packages.length;

  return document;
}